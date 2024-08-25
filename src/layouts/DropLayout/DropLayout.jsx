import {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import "./DropLayout.css"
import StreamLayout from "../StreamLayout/StreamLayout.jsx";


function DropLayout() {
    const [uploading, setUploading] = useState(false);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState(null);


    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        setFile(file);
        handleUpload(file);
    }, []);

    const handleUpload = (file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('video', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://45.141.102.127:8000/api/v1/video-file', true);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentage = Math.round((event.loaded / event.total) * 100);
                setProgress(percentage);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                setUploading(false);
                setFileUploaded(true);
            } else {
                console.error('Ошибка загрузки файла');
                setUploading(false);
                setFileUploaded(false);
            }
        };

        xhr.onerror = () => {
            console.error('Ошибка сети');
            setUploading(false);
            setFileUploaded(false);
        };

        xhr.send(formData);
    };

    const {getRootProps, getInputProps} = useDropzone({onDrop});

    return (
        <div className="drop-layout">
            {!fileUploaded ? (
                <div className="dropzone-container" {...getRootProps()}>
                    <input {...getInputProps()} />
                    {!uploading ? (
                        <div className="drag-drop">
                            <p>Перетащите файл сюда или кликните, чтобы выбрать</p>
                        </div>
                    ) : (
                        <div className="uploading-container">
                            <p style={{color: "black"}}>Загрузка файла: {progress}%</p>
                            <div className="progress-bar">
                                <div
                                    className="progress"
                                    style={{width: `${progress}%`}}
                                />
                            </div>
                        </div>
                    )}
                </div>
            ) : (!uploading ? (
                    <StreamLayout/>) : (<></>
                )

            )}
        </div>
    );
}

export default DropLayout;
