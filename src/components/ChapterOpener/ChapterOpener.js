import React, { Component, Fragment } from "react";
import "./ChapterOpener.css";
import Loading from "../Loading/Loading";
export default class ChapterOpener extends Component {
	state = {
		pages: [],
		chapterEnd: false,
		singlePage: true,
		active: 0
	};
	navigateChapter = e => {
		if (this.state.singlePage) {
			if (e.deltaY < 0)
				this.setState(prev => ({
					active: Math.max(prev.active - 1, 0)
				}));
			if (e.deltaY > 0)
				this.setState(prev => ({
					active: Math.min(
						prev.active + 1,
						this.props.manga[this.activeChapter].length - 1
					)
				}));
		}
	};
	loadPage = (chapter, page) => blob => {
		let pages = [...this.state.pages];
		pages[page].file = blob;
		pages[page].loading = false;
		!this.unmounted &&
			this.setState({
				pages: pages
			});
	};
	loadChapter = chapter => {
		let manga, pages;
		if (this.props.manga.length) {
			manga = [...this.props.manga];
			pages = [...manga[chapter]];
		} else {
			manga = [];
			pages = [];
		}
		this.setState({
			pages: pages
		});
		for (let j = 0; j < pages.length; ++j) {
			if (pages[j].loading)
				pages[j].file.async("blob").then(this.loadPage(chapter, j));
		}
	};
	unmounted = false;
	componentWillUnmount() {
		this.unmounted = true;
	}
	componentDidMount() {
		this.activeChapter = !!this.props.match.params.chapter
			? this.props.match.params.chapter
			: 0;
		if (this.activeChapter > this.props.manga.length - 1)
			this.setState({
				chapterEnd: true
			});
		else this.loadChapter(this.activeChapter);
	}
	changeChapter = increment => () => {
		let nextChapter = parseInt(this.activeChapter, 10) + increment;
		if (nextChapter < 0) return;
		else this.props.history.push("/" + nextChapter);
		window.scrollTo(0, 0);
	};
	render() {
		let chapterImages = [];
		if (!!this.props.manga.length) {
			let pages = this.state.pages;
			chapterImages = pages.map((e, i) => {
				if (this.state.singlePage && i !== this.state.active)
					return null;
				let urlCreator = window.URL || window.webkitURL;
				let imgsrc = "";
				if (!e.loading) imgsrc = urlCreator.createObjectURL(e.file);
				return (
					<Fragment
						key={"chapter-" + this.activeChapter + " page-" + i}
					>
						{!this.state.chapterEnd && (
							<div
								className={
									"page" +
									(!this.state.singlePage ? " single" : "")
								}
							>
								<div className="image-container">
									<Loading
										loading={e.loading}
										conditional={true}
									>
										<img
											src={imgsrc}
											alt={
												"chapter-" +
												this.activeChapter +
												" page-" +
												i
											}
										/>
									</Loading>
								</div>
							</div>
						)}
					</Fragment>
				);
			});
		}
		return (
			<Fragment>
				{!!this.props.manga.length &&
					this.state.chapterEnd && (
						<div className="page">
							<div className="image-container">
								End of chapters
							</div>
						</div>
					)}
				<div
					style={{ width: "100%", height: "auto" }}
					onWheel={this.navigateChapter}
				>
					{chapterImages}
				</div>
				{!!this.props.manga.length && (
					<Fragment>
						<div
							className={
								"prev" +
								(parseInt(this.activeChapter, 10) - 1 < 0
									? " disabled"
									: "")
							}
							onClick={this.changeChapter(-1)}
						>
							<i className="fa fa-angle-left" />
						</div>
						<div
							className={
								"next" +
								(parseInt(this.activeChapter, 10) + 1 >
								this.props.manga.length - 1
									? " disabled"
									: "")
							}
							onClick={this.changeChapter(1)}
						>
							<i className="fa fa-angle-right" />
						</div>
						{this.state.singlePage && (
							<div className="util">
								{this.state.active +
									1 +
									" / " +
									this.props.manga[this.activeChapter || 0]
										.length}
							</div>
						)}
					</Fragment>
				)}
			</Fragment>
		);
	}
}
