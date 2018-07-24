import React, { Component } from "react";
import UploadManga from "./components/UploadManga/UploadManga";
import jszip from "jszip";
import ChapterOpener from "./components/ChapterOpener/ChapterOpener";
import { Route, withRouter } from "react-router-dom";
class App extends Component {
	state = {
		manga: []
	};
	getFile = buffer => {
		let zip = new jszip();
		zip.loadAsync(buffer, { type: "arraybuffer" }).then(data => {
			let files = data.files;
			let prevFolderName = "/";
			let chapter = -1;
			let manga = [];
			for (let file in files) {
				if (files[file].dir) continue;
				else {
					let name_object = files[file].name.split("/");
					let foldername = name_object[0];
					let filename = name_object[1];
					if (foldername !== prevFolderName) {
						prevFolderName = foldername;
						++chapter;
						manga.push([]);
					}
					while (parseInt(filename, 10) > manga[chapter].length)
						manga[chapter].push(-1);
					manga[chapter][parseInt(filename, 10) - 1] = {
						loading: true,
						file: files[file]
					};
				}
			}
			this.setState({
				manga: manga
			});
			this.props.history.push("/0");
		});
	};
	render() {
		return (
			<div className="App">
				{!this.state.manga.length && (
					<UploadManga
						placeholder="Upload Manga"
						sendFile={this.getFile}
					/>
				)}
				<Route
					path="/:chapter"
					component={routeProps => {
						return (
							<ChapterOpener
								manga={this.state.manga}
								{...routeProps}
							/>
						);
					}}
					exact
				/>
			</div>
		);
	}
}

export default withRouter(App);
