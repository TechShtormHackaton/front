import { useRef, useEffect, useState } from 'react';
import "./StreamLayout.css";

function StreamLayoutNEW({ videoFile }) {
    const videoRef = useRef(null);
    const [events, setEvents] = useState({
        total_priemy: 0,
        total_faceoff: 0,
    });

    useEffect(() => {
        if (videoFile) {
            const videoURL = URL.createObjectURL(videoFile);
            videoRef.current.src = videoURL;
            videoRef.current.play();

            processAndUploadVideo(videoFile);
        }
    }, [videoFile]);

    const processAndUploadVideo = (videoFile) => {
        const videoElement = videoRef.current;
        videoElement.onloadedmetadata = () => {
            const chunkDuration = 3; // Длительность каждого сегмента в секундах

            uploadNextSegment(videoFile, 0, chunkDuration);
        };
    };

    const uploadNextSegment = (videoFile, currentTime, chunkDuration) => {
        const videoElement = videoRef.current;
        const duration = videoElement.duration;

        if (currentTime < duration) {
            captureAndSendSegment(videoFile, currentTime);

            const nextTime = currentTime + chunkDuration;
            const delay = chunkDuration * 1000;

            setTimeout(() => {
                uploadNextSegment(videoFile, nextTime, chunkDuration);
            }, delay);
        }
    };

    const captureAndSendSegment = (videoFile, startTime) => {
        // Корректно определяем MIME-тип и расширение
        const fileType = videoFile.type || 'video/webm';
        const fileExtension = fileType.split('/')[1];
        const segmentFileName = `${videoFile.name.split('.')[0]}_segment_${startTime}.${fileExtension}`;

        const videoBlob = videoFile.slice(startTime * 1000, (startTime + 3) * 1000, fileType);
        sendSegmentToServer(videoBlob, segmentFileName);
    };

    const sendSegmentToServer = (videoBlob, segmentFileName) => {
        const formData = new FormData();
        formData.append('video', videoBlob, segmentFileName);

        fetch('http://45.141.102.127:8000/api/v1/video-file', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log('Server response:', data);
                setEvents(prevEvents => ({
                    total_priemy: prevEvents.total_priemy + data.total_priemy,
                    total_faceoff: prevEvents.total_faceoff + data.total_faceoff,
                }));
            })
            .catch(error => {
                console.error('Error uploading segment:', error);
                // Здесь можно добавить пользовательский интерфейс для отображения ошибок
            });
    };

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

export default StreamLayoutNEW;
