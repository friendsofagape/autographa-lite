import React from "react";
import AutographaStore from "./AutographaStore";
import { FormattedMessage } from "react-intl";
import { ReactMicPlus } from "react-mic-plus";
import { observer } from "mobx-react";
import swal from 'sweetalert';
import RaisedButton from "material-ui/RaisedButton";
import AudioPlayer from "react-h5-audio-player";
const Modal = require("react-bootstrap/lib/Modal");
const db = require(`${__dirname}/../util/data-provider`).targetDb();
const constants = require("../util/constants");
let saveRec = require("../util/Rec_save_exp");
var file, savedfile = [];

@observer
class RecorderModal extends React.Component {
  state = {
    record: false,
    playSrc: ""
  };

  startRecording = () => {
    this.setState({
      record: true
    });
  };

  stopRecording = () => {
    this.setState({
      record: false
    });
  };

  onStop = async recordedBlob => {
    console.log("recordedBlob is: ", recordedBlob);
    file = recordedBlob;
    var book = {};
    var doc = await db.get("targetBible");
    doc = doc.targetPath;
    book.bookNumber = AutographaStore.bookId.toString();
    book.bookName = constants.booksList[parseInt(book.bookNumber, 10) - 1];
    file["bookName"] = `${book.bookName} Chapter${AutographaStore.chapterId} ${Date.now()}`;
    savedfile.push(file);
    console.log(savedfile);
  };
  closeRecorder = () => {
    AutographaStore.showModalRecorder = false;
  };
  playrecorder = key => {
    AutographaStore.showModalPlayer = true;
    this.setState({ playSrc: savedfile[key].blobURL });
  };
  closePlayer = () => {
    AutographaStore.showModalPlayer = false;
  };

  saveRecorder = async key => {
    let book = {};
    let filesave;
    const currentTrans = AutographaStore.currentTrans;
    let doc = await db.get("targetBible");
    doc = doc.targetPath;
    let chapter = "Chapter" + AutographaStore.chapterId;
    book.bookNumber = AutographaStore.bookId.toString();
    book.bookName = constants.booksList[parseInt(book.bookNumber, 10) - 1];
    filesave = await saveRec.recSave(book, savedfile[key], chapter);
    AutographaStore.showModalRecorder = false;
    swal({
      title: currentTrans["dynamic-msg-saved-change"],
      text: `${currentTrans["dynamic-msg-save-recordedfile"]} : ${filesave}`
    });
  };

  render() {
    return (
      <div>
        <Modal
          show={AutographaStore.showModalRecorder}
          onHide={this.closeRecorder}
          className="RecTab"
          id="tab-record"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FormattedMessage id="tooltip-recorder" />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <ReactMicPlus
                record={this.state.record}
                className="sound-wave"
                onStop={this.onStop}
                strokeColor="#000000"
                backgroundColor="#0069D6"
                nonstop={true}
              />
              <RaisedButton
                buttonStyle={{ borderRadius: 25 }}
                style={{ borderRadius: 25, marginLeft: "30px" }}
                onClick={this.startRecording}
              >
                <i className="fa fa-microphone" />
              </RaisedButton>
              <RaisedButton
                buttonStyle={{ borderRadius: 25 }}
                style={{ borderRadius: 25 }}
                backgroundColor={"white"}
                onClick={this.stopRecording}
              >
                <i className="fa fa-stop" />
              </RaisedButton>
              <RaisedButton
                buttonStyle={{ borderRadius: 25 }}
                style={{ borderRadius: 25 }}
                backgroundColor={"white"}
                onClick={this.playrecorder}
              >
                <i className="fa fa-play-circle" />
              </RaisedButton>
            </div>
            <div className="savelist">
              {savedfile.map((file, key) => (
                <span
                  id={key}
                  key={key}
                  style={{
                    width: "550px",
                    display: "inline-block"
                  }}
                >
                  <ul>
                    {file.bookName}
                    <RaisedButton
                      buttonStyle={{ borderRadius: 25 }}
                      className="saveRec"
                      style={{ borderRadius: 25 }}
                      backgroundColor={"white"}
                      onClick={() => this.saveRecorder(key)}
                    >
                      <i className="fa fa-floppy-o" />
                    </RaisedButton>
                    <RaisedButton
                      buttonStyle={{ borderRadius: 25 }}
                      className="playRec"
                      style={{ borderRadius: 25 }}
                      backgroundColor={"white"}
                      onClick={() => this.playrecorder(key)}
                    >
                      <i className="fa fa-play-circle" />
                    </RaisedButton>
                    <Modal
                      show={AutographaStore.showModalPlayer}
                      onHide={this.closePlayer}
                      className="playerModel"
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Player</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <AudioPlayer
                          src={this.state.playSrc}
                          onPlay={e => console.log("onPlay")}
                        />
                      </Modal.Body>
                    </Modal>
                  </ul>
                </span>
              ))}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default RecorderModal;