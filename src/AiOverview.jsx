import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export default function AiOverview({ weather }) {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const askWeather = async () => {
        setLoading(true);

        try {
            const prompt = `
Act as a professional weather expert.

Here is the current weather:

Temperature: ${weather.current.temperature_2m}°C
Precipitation: ${weather.current.precipitation} mm
Humidity: ${weather.current.relative_humidity_2m}%
Wind Speed: ${weather.current.wind_speed_10m} km/h
Wind Direction: ${weather.current.wind_direction_10m}°

Give me a short and useful recommendation about this weather. In 6-7 words.

Return ONLY JSON in this format:
{
  "recommendation": "your recommendation",
  "weather": "good"
}

weather must be one of:
"good", "moderate", "bad", etc...
`;

            console.log(prompt);

            const response = await ai.models.generateContent({
                model: "gemini-3.8-flash",
                contents: prompt,
            });

            const data = JSON.parse(response.text);

            setResult(data);
        } catch (error) {
            console.error(error);
        }

        setLoading(false);
    };

    return (
        <>
            {!result && (
                <div onClick={askWeather} className='bg-indigo-400 text-blue-50 p-4 rounded-lg shadow-sm hover:shadow-lg hover:cursor-pointer w-130 my-10 flex justify-between items-center'>
                    <button>
                        {loading ? "Checking..." : "AI Weather Recommendation"}
                    </button>

                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /><path d="M20 2v4" /><path d="M22 4h-4" /><circle cx="4" cy="20" r="2" /></svg>
                    </div>
                </div>
            )}

            <div>
                {result && (
                    <div className='bg-indigo-400 text-blue-50 p-4 rounded-lg shadow-sm w-130 my-10'>
                        <p>Weather: <strong>{result.weather.toUpperCase()}</strong></p>
                        <p>{result.recommendation}</p>
                    </div>
                )}
            </div>
        </>
    );
}
