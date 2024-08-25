import {useEffect, useRef, useState} from 'react';
import "./StreamLayout.css";

function StreamLayoutNEW({videoFile}) {
    const videoRef = useRef(null);
    const [events, setEvents] = useState({
        power_state: 0,
        throws_state: 0,
        safes_state: 0,
        description: ""
    });

    // Воспроизведение видео при монтировании компонента
    useEffect(() => {
        if (videoRef.current && videoFile) {
            const videoURL = URL.createObjectURL(videoFile);
            videoRef.current.src = videoURL;

            // Воспроизведение видео может быть заблокировано браузером,
            // поэтому мы просто устанавливаем источник и оставляем управление пользователю
            videoRef.current.play().catch(error => {
                console.error('Автовоспроизведение было заблокировано:', error);
            });

            // Очистка URL после размонтирования компонента
            return () => {
                URL.revokeObjectURL(videoURL);
            };
        }
    }, [videoFile]);

    // Обновление данных таблицы каждые 2 секунды
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/result');
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                const data = await response.json();
                console.log("data: ", data);
                if (data.message !== "All frames have been sent") {


                    // Обновление состояния
                    setEvents(prevEvents => ({
                        power_state: data.results.power_state !== null ? prevEvents.power_state + 1 : prevEvents.power_state,
                        throws_state: data.results.throws_state !== null ? prevEvents.throws_state + 1 : prevEvents.throws_state,
                        safes_state: data.results.safes_state !== null ? prevEvents.safes_state + 1 : prevEvents.safes_state,
                        description: data.results.description || prevEvents.description // Обновить описание только если оно не пустое
                    }));
                }
            } catch (error) {
                console.error('Ошибка при обновлении данных:', error);
            }
        };

        const interval = setInterval(fetchData, 2000);

        return () => clearInterval(interval); // Очистка интервала при размонтировании компонента
    }, []);

    return (
        <div className="stream-layout">
            <div className="iframe-container">
                <video ref={videoRef} controls style={{width: '100%'}}/>
            </div>
            <div className="table-container">
                <h2>Онлайн события</h2>
                <table>
                    <tbody>
                    <tr>
                        <td>Силовые</td>
                        <td>{events.power_state}</td>
                    </tr>
                    <tr>
                        <td>Вбросы</td>
                        <td>{events.throws_state}</td>
                    </tr>
                    <tr>
                        <td>Спасение вратаря</td>
                        <td>{events.safes_state}</td>
                    </tr>
                    <tr>
                        <td>Описание событий</td>
                        <td>{events.description}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StreamLayoutNEW;