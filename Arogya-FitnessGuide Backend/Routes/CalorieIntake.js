const express = require('express');
const router = express.Router();
const authTokenHandler = require('../Middlewares/checkAuthToken');
const jwt = require('jsonwebtoken');
const errorHandler = require('../Middlewares/errorMiddleware');
const request = require('request');
const User = require('../Models/UserSchema');
require('dotenv').config();


function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}


router.get('/test', authTokenHandler, async (req, res) => {
    res.json(createResponse(true, 'Test API works for calorie intake report'));
});

router.post('/addcalorieintake', authTokenHandler, async (req, res) => {
    const { item, date, quantity, quantitytype } = req.body;

    if (!item || !date || typeof quantity === 'undefined' || !quantitytype) {
        return res.status(400).json(createResponse(false, 'Please provide all required fields: item, date, quantity, and quantity type.'));
    }

    const parsedQuantity = parseFloat(quantity);
    if (isNaN(parsedQuantity)) {
        return res.status(400).json(createResponse(false, 'Quantity must be a valid number.'));
    }

    let qtyInGrams = 0;
    if (quantitytype === 'g') {
        qtyInGrams = parsedQuantity;
    } else if (quantitytype === 'kg') {
        qtyInGrams = parsedQuantity * 1000;
    } else if (quantitytype === 'ml') {
        qtyInGrams = parsedQuantity;
    } else if (quantitytype === 'l') {
        qtyInGrams = parsedQuantity * 1000;
    } else {
        return res.status(400).json(createResponse(false, 'Invalid quantity type. Must be g, kg, ml, or l.'));
    }

    var query = item;
    request.get({
        url: 'https://api.api-ninjas.com/v1/nutrition?query=' + query,
        headers: {
            'X-Api-Key': process.env.NUTRITION_API_KEY,
        },
    }, async function (error, response, body) {
        if (error) {
            console.error('Nutrition API Request failed:', error);
            return res.status(500).json(createResponse(false, 'Failed to fetch nutrition data from external API.'));
        } else if (response.statusCode !== 200) {
            console.error('Error from Nutrition API:', response.statusCode, body.toString('utf8'));
            return res.status(response.statusCode).json(createResponse(false, 'Error from Nutrition API: ' + body.toString('utf8')));
        } else {
            let apiResponseData;
            try {
                apiResponseData = JSON.parse(body);
            } catch (parseError) {
                console.error('Failed to parse Nutrition API response:', parseError);
                return res.status(500).json(createResponse(false, 'Invalid response from nutrition API.'));
            }

            let calculatedCalorieIntake = 0;

            if (apiResponseData && apiResponseData.length > 0 && apiResponseData[0]) {
                const apiItem = apiResponseData[0];
                
                const fatTotalG = apiItem.fat_total_g && !isNaN(parseFloat(apiItem.fat_total_g)) ? parseFloat(apiItem.fat_total_g) : 0;
                const carbsTotalG = apiItem.carbohydrates_total_g && !isNaN(parseFloat(apiItem.carbohydrates_total_g)) ? parseFloat(apiItem.carbohydrates_total_g) : 0;

                // Estimate calories: Fat (9 kcal/g), Carbs (4 kcal/g)
                // Assuming fat_total_g and carbohydrates_total_g from API are for a standard 100g portion,
                // as serving_size_g is premium.
                // Scale based on user's entered quantity relative to 100g.
                const caloriesPer100g = (fatTotalG * 9) + (carbsTotalG * 4);
                
                // Scale to user's quantity (if qtyInGrams is for a smaller/larger portion)
                if (qtyInGrams > 0) { // Avoid division by zero if qtyInGrams is somehow 0
                     calculatedCalorieIntake = (caloriesPer100g / 100) * qtyInGrams;
                } else {
                    calculatedCalorieIntake = caloriesPer100g; // If qtyInGrams is 0, just use per 100g value
                }
               
                calculatedCalorieIntake = parseFloat(calculatedCalorieIntake.toFixed(2));

                if (isNaN(calculatedCalorieIntake)) {
                    calculatedCalorieIntake = 0;
                }
            } else {
                console.warn('API-Ninjas: No relevant free-tier nutrition data found for item. Setting calculated calories to 0.');
            }

            const userId = req.userId;
            const user = await User.findOne({ _id: userId });

            if (!user) {
                return res.status(404).json(createResponse(false, 'User not found.'));
            }

            user.calorieIntake.push({
                item,
                date: new Date(date),
                quantity: parsedQuantity,
                quantitytype,
                calculatedCalorieIntake, // Storing the calculated value
            });

            try {
                await user.save();
                res.json(createResponse(true, 'Calorie intake added successfully'));
            } catch (saveError) {
                console.error('Error saving user:', saveError);
                if (saveError.name === 'ValidationError') {
                    return res.status(400).json(createResponse(false, 'Validation failed: ' + saveError.message));
                }
                res.status(500).json(createResponse(false, 'Failed to save calorie intake due to internal error.'));
            }
        }
    });
});

router.post('/getcalorieintakebydate', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const userId = req.userId;

    const user = await User.findById({ _id: userId });
    if (!user) return res.status(404).json(createResponse(false, 'User not found.'));

    let filteredCalorieIntake = [];
    if (!date) {
        const today = new Date();
        filteredCalorieIntake = filterEntriesByDate(user.calorieIntake, today);
        return res.json(createResponse(true, 'Calorie intake for today', filteredCalorieIntake));
    }

    filteredCalorieIntake = filterEntriesByDate(user.calorieIntake, new Date(date));
    res.json(createResponse(true, 'Calorie intake for the date', filteredCalorieIntake));
});

router.post('/getcalorieintakebylimit', authTokenHandler, async (req, res) => {
    const { limit } = req.body;
    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    if (!user) return res.status(404).json(createResponse(false, 'User not found.'));
    if (!limit) {
        return res.status(400).json(createResponse(false, 'Please provide limit'));
    } else if (limit === 'all') {
        // Ensure user.calorieIntake is an array, provide empty array if not
        const dataToSend = user.calorieIntake && Array.isArray(user.calorieIntake) ? user.calorieIntake : [];
        console.log("Backend sending 'all' calorie intake data:", dataToSend); // ADD THIS
        return res.json(createResponse(true, 'Calorie intake', dataToSend));
    } else {
        let date = new Date();
        let currentDate = new Date(date.setDate(date.getDate() - parseInt(limit)));
        
        let filteredCalorieIntake = user.calorieIntake && Array.isArray(user.calorieIntake) 
                                ? user.calorieIntake.filter((item) => {
                                      return new Date(item.date).getTime() >= currentDate.getTime();
                                  })
                                : []; // Filter only if it's an array

        console.log(`Backend sending '${limit}' days calorie intake data:`, filteredCalorieIntake); // ADD THIS
        return res.json(createResponse(true, `Calorie intake for the last ${limit} days`, filteredCalorieIntake));
    }
});

router.delete('/deletecalorieintake', authTokenHandler, async (req, res) => {
    const { item, date } = req.body;

    if (!item || !date) {
        return res.status(400).json(createResponse(false, 'Please provide all the details'));
    }

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    if (!user) {
        return res.status(404).json(createResponse(false, 'User not found.'));
    }

    user.calorieIntake = user.calorieIntake.filter((entry) => {
        const entryDate = new Date(entry.date);
        const targetDate = new Date(date);
        
        return !(entryDate.getFullYear() === targetDate.getFullYear() &&
                 entryDate.getMonth() === targetDate.getMonth() &&
                 entryDate.getDate() === targetDate.getDate() &&
                 entry.item === item);
    });

    try {
        await user.save();
        res.json(createResponse(true, 'Calorie intake deleted successfully'));
    } catch (saveError) {
        console.error('Error saving user after delete:', saveError);
        res.status(500).json(createResponse(false, 'Failed to delete calorie intake due to internal error.'));
    }
});

router.get('/getgoalcalorieintake', authTokenHandler, async (req, res) => {
    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    if (!user) return res.status(404).json(createResponse(false, 'User not found.'));

    if (!user.height || user.height.length === 0 || !user.weight || user.weight.length === 0) {
        return res.status(400).json(createResponse(false, 'Height and weight data is required to calculate goal calorie intake.'));
    }

    let heightInCm = parseFloat(user.height[user.height.length - 1].height);
    let weightInKg = parseFloat(user.weight[user.weight.length - 1].weight);
    
    if (isNaN(heightInCm) || isNaN(weightInKg)) {
        return res.status(400).json(createResponse(false, 'Invalid height or weight data.'));
    }

    let age = new Date().getFullYear() - new Date(user.dob).getFullYear();
    if (isNaN(age)) {
        return res.status(400).json(createResponse(false, 'Invalid date of birth.'));
    }

    let BMR = 0;
    let gender = user.gender;

    if (gender == 'male') {
        BMR = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * age);
    } else if (gender == 'female') {
        BMR = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * age);
    } else {
        BMR = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * age);
    }
    
    if (isNaN(BMR)) {
        return res.status(500).json(createResponse(false, 'Could not calculate BMR.'));
    }

    let maxCalorieIntake = 0;
    if (user.goal == 'weightLoss') {
        maxCalorieIntake = BMR - 500;
    } else if (user.goal == 'weightGain') {
        maxCalorieIntake = BMR + 500;
    } else {
        maxCalorieIntake = BMR;
    }
    
    maxCalorieIntake = parseFloat(maxCalorieIntake.toFixed(2));

    res.json(createResponse(true, 'max calorie intake', { maxCalorieIntake }));
});


function filterEntriesByDate(entries, targetDate) {
    if (!entries || !Array.isArray(entries)) {
        return [];
    }
    if (!(targetDate instanceof Date) || isNaN(targetDate.getTime())) {
        return entries;
    }

    return entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return (
            entryDate.getDate() === targetDate.getDate() &&
            entryDate.getMonth() === targetDate.getMonth() &&
            entryDate.getFullYear() === targetDate.getFullYear()
        );
    });
}
module.exports = router;