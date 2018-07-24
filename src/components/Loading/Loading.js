import React, { Fragment } from "react";
import "./Loading.css";
export default props => {
	return (
		<Fragment>
			{(!!props.conditional && props.loading) ? null:props.children}
			{props.loading && (
				<div className="loading-wrapper">
					<div className="loading">
						<div className="loading-cell">
							<div className="lds-ellipsis">
								<div />
								<div />
								<div />
								<div />
							</div>
						</div>
					</div>
				</div>
			)}
		</Fragment>
	);
};
