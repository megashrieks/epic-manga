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
			let manga = [];
			let temp = {};
			for (let file in files) {
				if (files[file].dir) continue;
				else {
					let name_object = files[file].name.split("/");
					let foldername = name_object[0];
					let filename = name_object[1];
					if (!!!temp[foldername]) temp[foldername] = [];
					while (parseInt(filename, 10) > temp[foldername].length)
						temp[foldername].push(-1);
					temp[foldername][parseInt(filename, 10) - 1] = {
						loading:true,
						file:files[file]
					};
				}
			}
			let temp_keys_array = [];
			for (let folder in temp) {
				temp_keys_array.push(folder);
			}
			temp_keys_array.sort();
			for (let j = 0; j < temp_keys_array.length; ++j){
				manga.push(temp[temp_keys_array[j]]);
			}
			console.log(manga);
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
