import React, { useEffect, useRef } from "react";

export const MentionItem = ({ isActive, className, style, ...props }) => {
	const ref = useRef(null);

	useEffect(() => {
		if (isActive) {
			ref.current?.scrollIntoView({ block: "nearest" });
		}
	}, [isActive]);

	return (
		<div
			ref={ref}
			className={"mentionsItem" + (className ? ` ${className}` : "")}
			style={{
				backgroundColor: isActive ? "lightgrey" : undefined,
				...style,
			}}
			{...props}
		/>
	);
};
