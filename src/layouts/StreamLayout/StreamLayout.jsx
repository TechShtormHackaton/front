import "./StreamLayout.css"
import {useEffect, useRef, useState} from "react";

// function StreamLayoutOLD() {
//     return (
//         <div className="stream-layout">
//             <div className="iframe-container">
//                 <iframe
//                     src="https://www.youtube.com/embed/J5TXRLSOn3o"
//                     title="Stream"
//                     frameBorder="0"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                 ></iframe>
//             </div>
//             <div className="table-container">
//                 <h2>Онлайн события</h2>
//                 <table>
//                     <tbody>
//                     <tr>
//                         <td>Силовые</td>
//                     </tr>
//                     <tr>
//                         <td>Выбросы</td>
//                     </tr>
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }
//
// export default StreamLayoutOLD;
function StreamLayout() {
    const [events, setEvents] = useState({
        "total_priemy": 0,
        "total_faceoff": 0
    });
    const videoRef = useRef(null);

    useEffect(() => {
        // Устанавливаем прямую ссылку на стриминг видео
        const videoURL = 'http://45.141.102.127:8000/api/v1/stream'; // URL для прямого эфира
        if (videoRef.current) {
            videoRef.current.src = videoURL;

            videoRef.current.onloadeddata = () => {
                videoRef.current.play().catch(error => {
                    console.error('Error playing video stream:', error);
                });
            };
        }
    }, []);


    // useEffect(() => {
    //     const fetchEvents = () => {
    //         fetch('http://45.141.102.127:8000/api/v1/stream')
    //             .then(response => response.json())
    //             .then(data => {
    //                 setEvents(data);
    //                 console.log('Event data received:', data);
    //             })
    //             .catch(error => {
    //                 console.error('Error fetching event data:', error);
    //             });
    //     };
    //
    //     const intervalId = setInterval(fetchEvents, 3000); // Запрашиваем данные каждые 3 секунды
    //
    //     return () => clearInterval(intervalId); // Очищаем интервал при размонтировании компонента
    // }, []);

    return (
        <div className="stream-layout">
            <div className="iframe-container">
                <video ref={videoRef} controls style={{ width: '100%' }} />
            </div>
            <div className="table-container">
                <h2>Онлайн события</h2>
                <table>
                    <tbody>
                    <tr>
                        <td>Силовые</td>
                        <td>{events.total_priemy}</td>
                    </tr>
                    <tr>
                        <td>Вбросы</td>
                        <td>{events.total_faceoff}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StreamLayout;