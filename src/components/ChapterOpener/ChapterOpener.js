import React, { Component, Fragment } from "react";
import "./ChapterOpener.css";
import Loading from "../Loading/Loading";
export default class ChapterOpener extends Component {
	state = { pages: [], chapterEnd: false, singlePage: true, active: 0 };
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
		this.setState({ pages: pages });
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
		this.activeChapter = Math.max(
			Math.min(
				!!this.props.match.params.chapter
					? this.props.match.params.chapter
					: 0,
				this.props.manga.length
			),
			0
		);
		if (this.activeChapter > this.props.manga.length - 1) {
			this.setState({ chapterEnd: true });
		} else this.loadChapter(this.activeChapter);
	}
	changeChapter = increment => () => {
		let nextChapter = parseInt(this.activeChapter, 10) + increment;
		if (nextChapter < 0) return;
		else if (nextChapter <= this.props.manga.length) {
			this.props.history.push("/" + nextChapter);
			window.scrollTo(0, 0);
		}
	};

	xDown = null;
	yDown = null;
	horizontalSwipeLength = 0.5;
	verticalSwipeLength = 0.15;
	handleTouchStart = evt => {
		this.xDown = evt.touches[0].clientX;
		this.yDown = evt.touches[0].clientY;
	};

	handleTouchMove = evt => {
		if (!this.xDown || !this.yDown) {
			return;
		}

		let xUp = evt.touches[0].clientX;
		let yUp = evt.touches[0].clientY;

		let xDiff = this.xDown - xUp;
		let yDiff = this.yDown - yUp;
		if (Math.abs(xDiff) > Math.abs(yDiff)) {
			if (
				Math.abs(xDiff) >
				this.horizontalSwipeLength * window.innerWidth
			) {
				if (xDiff > 0) {
					this.changeChapter(1)();
				} else {
					this.changeChapter(-1)();
				}
			}
		} else {
			if (
				Math.abs(yDiff) >
				this.verticalSwipeLength * window.innerHeight
			) {
				if (yDiff < 0)
					this.setState(prev => ({
						active: Math.max(prev.active - 1, 0)
					}));
				else
					this.setState(prev => ({
						active: Math.min(
							prev.active + 1,
							this.props.manga[this.activeChapter].length - 1
						)
					}));
			}
		}

		if (
			Math.abs(yDiff) > this.verticalSwipeLength * window.innerHeight ||
			Math.abs(xDiff) > this.horizontalSwipeLength * window.innerWidth
		) {
			this.xDown = null;
			this.yDown = null;
		}
	};
	render() {
		let check = false;
		(function(a) {
			if (
				/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
					a
				) ||
				/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
					a.substr(0, 4)
				)
			)
				check = true;
		})(navigator.userAgent || navigator.vendor || window.opera);
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
				<div
					style={{ width: "100%", height: "auto" }}
					onWheel={this.navigateChapter}
					onTouchStart={this.handleTouchStart}
					onTouchMove={this.handleTouchMove}
				>
					{!!this.props.manga.length &&
						this.state.chapterEnd && (
							<div className="page single">
								<div className="image-container">
									End of chapters
								</div>
							</div>
						)}
					{chapterImages}
					{!!this.props.manga.length && (
						<Fragment>
							<div
								className={
									"prev" +
									(parseInt(this.activeChapter, 10) - 1 < 0
										? " disabled"
										: "") +
									(check ? " mobile" : "")
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
										: "") +
									(check ? " mobile" : "")
								}
								onClick={this.changeChapter(1)}
							>
								<i className="fa fa-angle-right" />
							</div>
							{this.state.singlePage &&
								!this.state.chapterEnd && (
									<div className="util">
										{this.state.active +
											1 +
											" / " +
											this.props.manga[
												this.activeChapter || 0
											].length}
									</div>
								)}
						</Fragment>
					)}
				</div>
			</Fragment>
		);
	}
}
