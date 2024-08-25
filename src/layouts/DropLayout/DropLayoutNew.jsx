import {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import "./DropLayout.css"
import StreamLayoutNEW from "../StreamLayout/StreamLayoutNEW.jsx";


function DropLayoutNew() {
    const [file, setFile] = useState(null);


    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        setFile(file);
    }, []);

    const {getRootProps, getInputProps} = useDropzone({onDrop});

    return (
        <div className="drop-layout">
            {!file ? (
                <div className="dropzone-container" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="drag-drop">
                        <p>Перетащите файл сюда или кликните, чтобы выбрать</p>
                    </div>
                </div>
            ) : (
                <StreamLayoutNEW videoFile={file}/>)
            }
        </div>
    );
}
export default DropLayoutNew;
