import React, { Component } from "react";
import UploadManga from './components/UploadManga/UploadManga';
import jszip from 'jszip';
class App extends Component {
	state = {
		manga: []
	};
	chapterPusher = (chapter, filename) => blob => {
		let manga = [...this.state.manga];
		while(manga.length <= chapter)
			manga.push([]);
		while (manga[chapter].length <= (filename - 1))
			manga[chapter].push(0);
		manga[chapter][filename - 1] = blob;
		this.setState({
			manga:manga
		})
	}
	getFile = buffer => {
		let zip = new jszip();
		zip.loadAsync(buffer, { type: 'arraybuffer' }).then(data => {
			let files = data.files;
			let prevFolderName = "/";
			let chapter = -1;
			for (let file in files) {
				if (files[file].dir) continue;
				else {
					let name_object = files[file].name.split("/");
					let foldername = name_object[0];
					let filename = name_object[1];
					if (foldername !== prevFolderName) {
						prevFolderName = foldername;
						++chapter;
					}
					files[file].async("blob").then(this.chapterPusher(chapter,filename))
				}
			}
		});
	}
	render() {
		let imgsrc = "";
		if (this.state.manga.length) {
			// console.log()
			// var arrayBufferView = new Uint8Array();
			// var blob = new Blob([arrayBufferView], { type: "image/jpeg" });
			var urlCreator = window.URL || window.webkitURL;
			if (this.state.manga[0] && this.state.manga[0][0]) {
				console.log(this.state.manga[0][0]);
				imgsrc = urlCreator.createObjectURL(this.state.manga[0][0]);
			}
		}
		return <div className="App">
			<UploadManga
				placeholder="Upload student subjects"
				sendFile={this.getFile}
			/>
			<img src={imgsrc}/>
		</div>;
	}
}

export default App;
