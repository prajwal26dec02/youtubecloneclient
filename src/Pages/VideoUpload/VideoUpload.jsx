import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import "./VideoUpload.css";
import { uploadVideo } from "../../actions/video";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

function VideoUpload({ setVidUploadPage }) {
  const CurrentUser = useSelector((state) => state.CurrentUserReducer);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState("");

  const handleSetVideoFile = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const [progress, setProgress] = useState(0);

  const fileOptions = {
    onUploadProgress: (ProgressEvent) => {
      const { loaded, total } = ProgressEvent;
      const percentage = Math.floor((loaded * 100) / total);
      setProgress(percentage);
      if (percentage === 100) {
        setTimeout(function () {}, 3000);
        setVidUploadPage(false);
      }
    },
  };

  const uploadVideoFile = () => {
    if (!title) {
      alert("Please enter a title for your video");
    } else if (!videoFile) {
      alert("Please select a video file to upload");
    } else if (videoFile.size > 1000000) {
      alert("Video file size must be less than 1MB");
    } else {
      const fileData = new FormData();
      fileData.append("file", videoFile);
      fileData.append("title", title);
      fileData.append("channel", CurrentUser?.result._id);
      fileData.append("uploader", CurrentUser?.result.name);
      // console.log(videoFile);
      dispatch(uploadVideo({ fileData: fileData, fileOptions: fileOptions }));
    }
  };

  return (
    <div className="container_VidUpload">
      <input
        type="submit"
        name="text"
        value={"X"}
        onClick={() => setVidUploadPage(false)}
        className="ibtn_x"
      />
      <div className="container2_VidUpload">
        <div className="ibox_div_vidupload">
          <input
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="text"
            className="ibox_vidupload"
            maxLength={30}
            placeholder="Enter Title of your video"
          />
          <label htmlFor="file" className="ibox_vidupload btn_vidupload">
            <input
              onChange={(e) => {
                handleSetVideoFile(e);
              }}
              type="file"
              name="file"
              className="ibox_vidupload"
              style={{ fontSize: "1rem" }}
            />
          </label>
        </div>
        <div className="ibox_div_vidupload">
          <input
            onClick={uploadVideoFile}
            type="submit"
            value="Upload"
            className="ibox_vidupload btn_vidupload"
          />
        </div>
        <div className="loader ibox_div_vidupload">
          <CircularProgressbar
            value={progress}
            text={`${progress}`}
            styles={buildStyles({
              rotation: 0.25,
              strokeLinecap: "butt",
              textSize: "20px",
              pathTransitionDuration: 0.5,
              pathColor: `rgba(255,255,255,${progress / 100})`,
              textColor: "#f88",
              trailColor: "#adff2f",
              backgroundColor: "#3e98c7",
            })}
          />
        </div>
      </div>
    </div>
  );
}

export default VideoUpload;
