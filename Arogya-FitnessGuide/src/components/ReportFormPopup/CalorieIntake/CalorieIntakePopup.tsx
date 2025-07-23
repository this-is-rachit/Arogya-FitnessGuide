"use client"
import React from 'react'
import '../popup.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toast } from 'react-toastify';

interface CaloriIntakePopupProps {
    setShowCalorieIntakePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalorieIntakePopup: React.FC<CaloriIntakePopupProps> = ({ setShowCalorieIntakePopup }) => {
    const color = '#29cf92';

    const [date, setDate] = React.useState<Dayjs | null>(dayjs(new Date()));
    const [time, setTime] = React.useState<Dayjs | null>(dayjs(new Date()));

    const [calorieIntake, setCalorieIntake] = React.useState({ // Reverted state name
        item: '',
        date: '',
        quantity: '',
        quantitytype: 'g',
    });

    const [items, setItems] = React.useState<any>([]);

    const saveCalorieIntake = async () => { // Reverted function name
        const tempdate = date ? date.format('YYYY-MM-DD') : '';
        const temptime = time ? time.format('HH:mm:ss') : '';
        const tempdatetime = `${tempdate} ${temptime}`;
        const finaldatetime = new Date(tempdatetime);

        const quantityString = calorieIntake.quantity;
        const parsedQuantity = parseFloat(quantityString);

        if (
            calorieIntake.item === "" ||
            quantityString === "" ||
            isNaN(parsedQuantity) ||
            !(finaldatetime instanceof Date) || isNaN(finaldatetime.getTime())
        ) {
            toast.error('Please fill in all food item details (name, valid amount, date, and time).');
            return;
        }

        const payload = {
            item: calorieIntake.item,
            date: finaldatetime,
            quantity: parsedQuantity, // Send quantity as a number
            quantitytype: calorieIntake.quantitytype,
            // We are NOT sending calorieIntake field here. Backend will calculate it.
        };

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/addcalorieintake', { // Updated endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Server error: ${res.status}`);
            }

            const data = await res.json();
            if (data.ok) {
                toast.success('Calorie intake added successfully');
                getCalorieIntake(); // Reverted function call
                setCalorieIntake({ // Reverted state update
                    item: "",
                    date: date ? date.format('YYYY-MM-DD') : '',
                    quantity: "",
                    quantitytype: "g",
                });
            } else {
                toast.error('Error in adding calorie intake: ' + (data.message || 'Unknown error'));
            }
        } catch (err: any) {
            toast.error('Failed to add calorie intake: ' + err.message);
        }
    };

    const getCalorieIntake = async () => { // Reverted function name
        setItems([]);

        const dateForFetch = date ? date.format('YYYY-MM-DD') : '';

        if (!dateForFetch) {
            return;
        }

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/getcalorieintakebydate', { // Updated endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    date: dateForFetch
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Server error: ${res.status}`);
            }

            const data = await res.json();
            if (data.ok) {
                setItems(data.data);
            } else {
                toast.error('Error in getting calorie intake: ' + (data.message || 'Unknown error'));
            }
        } catch (err: any) {
            toast.error('Failed to get calorie intake: ' + err.message);
        }
    };

    const deleteCalorieIntake = async (itemToDelete: any) => { // Reverted function name
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/deletecalorieintake', { // Updated endpoint
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    item: itemToDelete.item,
                    date: itemToDelete.date
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Server error: ${res.status}`);
            }

            const data = await res.json();
            if (data.ok) {
                toast.success('Calorie intake item deleted successfully');
                getCalorieIntake();
            } else {
                toast.error('Error in deleting calorie intake: ' + (data.message || 'Unknown error'));
            }
        } catch (err: any) {
            toast.error('Failed to delete calorie intake: ' + err.message);
        }
    };

    React.useEffect(() => {
        getCalorieIntake();
        setCalorieIntake(prev => ({ ...prev, date: date ? date.format('YYYY-MM-DD') : '' }));
    }, [date]);

    const selectedDay = (val: Dayjs | null) => {
        setDate(val);
    };

    return (
        <div className='popupout'>
            <div className='popupbox'>
                <button className='close'
                    onClick={() => {
                        setShowCalorieIntakePopup(false);
                    }}
                >
                    <AiOutlineClose />
                </button>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Select Date"
                        value={date}
                        onChange={(newValue: Dayjs | null) => {
                            selectedDay(newValue);
                        }}
                    />
                </LocalizationProvider>

                <TextField
                    id="outlined-food-item"
                    label="Food item name" // Reverted label
                    variant="outlined"
                    color="success"
                    value={calorieIntake.item}
                    onChange={(e) => {
                        setCalorieIntake(prevCalorieIntake => ({
                            ...prevCalorieIntake,
                            item: e.target.value
                        }));
                    }}
                />

                <TextField
                    id="outlined-food-amount"
                    label="Food item amount (in gms)" // Reverted label
                    variant="outlined"
                    color="success"
                    type='number'
                    value={calorieIntake.quantity}
                    onChange={(e) => {
                        setCalorieIntake(prevCalorieIntake => ({
                            ...prevCalorieIntake,
                            quantity: e.target.value
                        }));
                    }}
                />
                <div className='timebox'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            label="Time picker"
                            value={time}
                            onChange={(newValue: Dayjs | null) => setTime(newValue)}
                        />
                    </LocalizationProvider>
                </div>

                <Button variant="contained" color="success" onClick={saveCalorieIntake}>
                    Save Calorie Intake {/* Reverted button text */}
                </Button>
                <div className='hrline'></div>
                <div className='items'>
                    {
                        items.length > 0 ? (
                            items.map((item: any, index: number) => {
                                return (
                                    <div className='item' key={item._id || index}>
                                        <h3>{item.item}</h3>
                                        <h3>{item.quantity} {item.quantitytype}</h3>
                                        {/* Display the calculated calorie intake from the fetched item */}
                                        {item.calculatedCalorieIntake !== undefined && <p>Calories: {item.calculatedCalorieIntake} kcal</p>}
                                        <button
                                            onClick={() => {
                                                deleteCalorieIntake(item);
                                            }}
                                        >
                                            <AiFillDelete />
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No calorie intake entries for this date.</p>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default CalorieIntakePopup;