import React, { Component, Fragment } from "react";
import "./UploadManga.css";
class UploadManga extends Component {
    state = {
        filename: "",
        file: null,
        filePath: "",
        uploading: false
    };
    changeData = ({ target: { value, files } }) => {
        if (files.length !== 0)
            this.setState({
                filename: files[0].name,
                file: files[0],
                filePath: value
            });
        else
            this.setState({
                filename: "",
                file: null,
                filePath: ""
            });
    };
    submit = e => {
        this.setState({ uploading: true });
        if (!!this.state.filename) {
            let filereader = new FileReader();
            filereader.onloadend = e => {
                this.props.sendFile(e.target.result);
            }
            filereader.readAsArrayBuffer(this.state.file);
            this.setState({
                filename: "",
                file: null,
                filePath: "",
                uploading: false
            });
        }
    };
    render() {
        return (
            <Fragment>
                <div
                    className={
                        "upload-wrapper" +
                        (this.state.uploading ? " disabled" : "")
                    }
                >
                    <form onSubmit={e => e.preventDefault()}>
                        <label
                            className={
                                "custom-file" +
                                (!!this.state.filename ? " active" : "")
                            }
                            htmlFor="fileme"
                        >
                            <span className="ocher">
                                <h4 className="fake-header">
                                    {!!!this.state.filename
                                        ? this.props.placeholder
                                        : this.state.filename}
                                </h4>
                            </span>
                            <input
                                onChange={this.changeData}
                                type="file"
                                id="fileme"
                                value={this.state.filePath}
                                disabled={this.state.uploading}
                            />
                        </label>
                        {!!this.state.filename && (
                            <button
                                className="submit-file"
                                type="submit"
                                onClick={this.submit}
                            >
                                <i className="fa fa-check" />
                            </button>
                        )}
                    </form>
                </div>
            </Fragment>
        );
    }
}
export default UploadManga;
