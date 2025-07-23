"use client"
import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import './ReportPage.css';
import { AiFillEdit } from 'react-icons/ai';
import CaloriIntakePopup from '@/components/ReportFormPopup/CalorieIntake/CalorieIntakePopup';
import { usePathname } from 'next/navigation';

const page = () => {
    const color = '#29cf92';
    const pathname = usePathname();
    const chartsParams = {
        height: 300,
    };

    const [dataS1, setDataS1] = React.useState<any>(null);

    const getDataForS1 = async () => {
        if (pathname === '/report/Calorie%20Intake') {
            try { // Added try-catch for the fetch itself
                const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/getcalorieintakebylimit', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ limit: 10 })
                });

                // Check if response is OK before trying to parse JSON
                if (!res.ok) {
                    const errorText = await res.text(); // Get raw text to debug
                    console.error("Backend response NOT OK:", res.status, errorText);
                    setDataS1([]); // Clear data on error
                    return;
                }

                const data = await res.json();
                console.log("Frontend received raw data object:", data); // LOG 1: Raw data object from backend

                if (data.ok) {
                    console.log("Frontend received data.data (array from backend):", data.data); // LOG 2: The array itself

                    // Check if data.data is an array and not empty
                    if (!Array.isArray(data.data) || data.data.length === 0) {
                        console.warn("Backend sent empty or non-array data.data. Chart will be empty.");
                        setDataS1([]); // Ensure data is an empty array if nothing is there
                        return;
                    }

                    let temp = data.data.map((item: any) => {
                        // Ensure item.calculatedCalorieIntake exists and is a number
                        const value = typeof item.calculatedCalorieIntake === 'number'
                                      ? item.calculatedCalorieIntake
                                      : parseFloat(item.calculatedCalorieIntake); // Try parsing if it's a string from old data

                        if (isNaN(value) || value === null || typeof value === 'undefined') {
                            console.warn(`Item has invalid calculatedCalorieIntake: ${item.calculatedCalorieIntake}. Setting to 0.`);
                            return { date: item.date, value: 0, unit: 'kcal' }; // Default to 0 for invalid values
                        }

                        return {
                            date: item.date,
                            value: value,
                            unit: 'kcal'
                        };
                    });
                    console.log("Mapped temp array (values extracted):", temp); // LOG 3: Intermediate mapped array

                    let dataForLineChart = temp.map((item: any) => {
                        // item.value should already be a number here.
                        return item.value;
                    });
                    console.log("Final dataForLineChart array (for chart data prop):", dataForLineChart); // LOG 4: Final chart data array

                    let dataForXAxis = temp.map((item: any) => {
                        let val = new Date(item.date);
                        if (isNaN(val.getTime())) { // Check for invalid dates
                            console.warn(`Invalid date encountered: ${item.date}. Skipping this date.`);
                            return null; // Or handle as appropriate
                        }
                        return val;
                    }).filter(val => val !== null); // Filter out any null dates

                    console.log("Final dataForXAxis array (for chart xAxis prop):", dataForXAxis); // LOG 5: Final X-axis data array

                    setDataS1({
                        data: dataForLineChart,
                        title: '1 Day Calorie Intake',
                        color: color,
                        xAxis: {
                            data: dataForXAxis,
                            label: 'Last 10 Days',
                            scaleType: 'time'
                        }
                    });
                } else {
                    console.error("Backend data.ok is false:", data.message);
                    setDataS1([]);
                }
            } catch (err: any) {
                console.error("Fetch or data processing error in getDataForS1:", err);
                setDataS1([]); // Ensure data is empty array on any error
            }
        } else {
            alert('get data for other reports');
        }
    };

    React.useEffect(() => {
        getDataForS1();
    }, [pathname]); // Depend on pathname to re-fetch when route changes

    const [showCalorieIntakePopup, setShowCalorieIntakePopup] = React.useState<boolean>(false);

    return (
        <div className='reportpage'>
            <div className='s1'>
                {/* Only render chart if dataS1 is not null AND has data in its 'data' array */}
                {dataS1 && dataS1.data && dataS1.data.length > 0 && dataS1.xAxis.data && dataS1.xAxis.data.length > 0 ? (
                    <LineChart
                        xAxis={[{
                            id: 'Day',
                            data: dataS1.xAxis.data,
                            scaleType: dataS1.xAxis.scaleType,
                            label: dataS1.xAxis.label,
                            valueFormatter: (date: any) => date.getDate()
                        }]}
                        series={[
                            {
                                data: dataS1.data,
                                label: dataS1.title,
                                color: dataS1.color,
                            },
                        ]}
                        {...chartsParams}
                    />
                ) : (
                    <p>No calorie intake data available for the last 10 days.</p> // Message if no data
                )}
            </div>

            <button className='editbutton'
                onClick={() => {
                    if (pathname === '/report/Calorie%20Intake') {
                        setShowCalorieIntakePopup(true);
                    }
                }}
            >
                <AiFillEdit />
            </button>

            {
                showCalorieIntakePopup && (
                    <CaloriIntakePopup setShowCalorieIntakePopup={setShowCalorieIntakePopup} />
                )
            }
        </div>
    );
};

export default page;