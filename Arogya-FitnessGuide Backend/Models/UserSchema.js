const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    weight: [
        {
            weight: {
                type: Number,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
        }
    ],
    height: [
        {
            height: {
                type: Number,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
        }
    ],
    gender: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    goal: {
        type: String,
        required: true,
    },
    calorieIntake: [ // Reverted to calorieIntake
        {
            item: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
            quantity: { // This is the amount of food item (e.g., in grams)
                type: Number,
                required: true,
            },
            quantitytype: {
                type: String,
                required: true,
            },
            // This field will store the calculated calories based on free-tier data
            calculatedCalorieIntake: { 
                type: Number,
                required: true,
            },
            // You can optionally add other free-tier nutrients if you want to store them:
            // totalFat_g: { type: Number },
            // saturatedFat_g: { type: Number },
            // carbohydrates_total_g: { type: Number },
            // fiber_g: { type: Number },
            // sugar_g: { type: Number },
            // sodium_mg: { type: Number },
            // potassium_mg: { type: Number },
            // cholesterol_mg: { type: Number },
        }
    ],
    activityLevel: {
        type: String,
        required: true,
    },
    sleep: [
        {
            date: {
                type: Date,
                required: true,
            },
            durationInHrs: {
                type: Number,
                required: true,
            },
        },
    ],
    steps: [
        {
            date: {
                type: Date,
                required: true,
            },
            steps: {
                type: Number,
                required: true,
            },
        },
    ],
    workouts: [
        {
            date: {
                type: Date,
                required: true,
            },
            exercise: {
                type: String,
                required: true,
            },
            durationInMinutes: {
                type: Number,
                required: true,
            },
        },
    ],
    water: [
        {
            date: {
                type: Date,
                required: true,
            },
            amountInMilliliters: {
                type: Number,
                required: true,
            },
        },
    ],
}, { timestamps: true });


userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});


const User = mongoose.model('User', userSchema);
module.exports = User;