import { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion";
import axios from "axios";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
import { MentionItem } from "./MentionItem.js";
import { useRef } from "react";
// import { useIsMounted } from "./useIsMounted";

export const useIsMounted = () => {
	const isMounted = useRef(true);
	useEffect(
		() => () => {
			isMounted.current = false;
		},
		[]
	);
	return isMounted;
};

export const MentionList = forwardRef(({ clientRect, command, query }, ref) => {
	const referenceEl = useMemo(() => (clientRect ? { getBoundingClientRect: clientRect } : null), [clientRect]);

	const isMounted = useIsMounted();
	const [people, setPeople] = useState([]);
	const [tagList, setTagList] = useState([]);
	useEffect(() => {
		setPeople([
			{ name: "Luke Skywalker", url: "https://swapi.dev/api/people/1/" },
			{ name: "C-3PO", url: "https://swapi.dev/api/people/2/" },
			{ name: "R2-D2", url: "https://swapi.dev/api/people/3/" },
			{ name: "Darth Vader", url: "https://swapi.dev/api/people/4/" },
			{ name: "Leia Organa", url: "https://swapi.dev/api/people/5/" },
			{ name: "Owen Lars", url: "https://swapi.dev/api/people/6/" },
			{ name: "Beru Whitesun lars", url: "https://swapi.dev/api/people/7/" },
			{ name: "R5-D4", url: "https://swapi.dev/api/people/8/" },
			{ name: "Biggs Darklighter", url: "https://swapi.dev/api/people/9/" },
			{ name: "Obi-Wan Kenobi", url: "https://swapi.dev/api/people/10/" },
		]);
		setTagList([
			{ name: "php", url: "https://swapi.dev/api/people/1/" },
			{ name: "java", url: "https://swapi.dev/api/people/2/" },
			{ name: "javascript", url: "https://swapi.dev/api/people/3/" },
			{ name: "python", url: "https://swapi.dev/api/people/4/" },
		]);
	}, [query, isMounted]);

	const handleCommand = (index) => {
		const selectedPerson = people[index];
		command({ id: selectedPerson.url, label: selectedPerson.name });
	};

	const [hoverIndex, setHoverIndex] = useState(0);
	useImperativeHandle(ref, () => ({
		onKeyDown: ({ event }) => {
			const { key } = event;

			if (key === "ArrowUp") {
				setHoverIndex((prev) => {
					const beforeIndex = prev - 1;
					return beforeIndex >= 0 ? beforeIndex : 0;
				});
				return true;
			}

			if (key === "ArrowDown") {
				setHoverIndex((prev) => {
					const afterIndex = prev + 1;
					const peopleCount = people.length - 1 ?? 0;
					return afterIndex < peopleCount ? afterIndex : peopleCount;
				});
				return true;
			}

			if (key === "Enter") {
				handleCommand(hoverIndex);
				return true;
			}

			return false;
		},
	}));

	const [el, setEl] = useState(null);
	const { styles, attributes } = usePopper(referenceEl, el, {
		placement: "bottom-start",
	});

	return createPortal(
		<div ref={setEl} className="mentionsContainer" style={styles.popper} {...attributes.popper}>
			{people.map((person, index) => (
				<MentionItem key={person.url} isActive={index === hoverIndex} onMouseEnter={() => setHoverIndex(index)} onClick={() => handleCommand(index)}>
					{person.name}
				</MentionItem>
			))}
		</div>,
		document.body
	);
});

export const MentionList2 = forwardRef(({ clientRect, command, query }, ref) => {
	const referenceEl = useMemo(() => (clientRect ? { getBoundingClientRect: clientRect } : null), [clientRect]);

	const isMounted = useIsMounted();
	// const [people, setPeople] = useState([]);
	const [tagList, setTagList] = useState([]);
	useEffect(() => {
		setTagList([
			{ name: "php", url: "https://swapi.dev/api/people/1/" },
			{ name: "java", url: "https://swapi.dev/api/people/2/" },
			{ name: "javascript", url: "https://swapi.dev/api/people/3/" },
			{ name: "python", url: "https://swapi.dev/api/people/4/" },
		]);
	}, [query, isMounted]);

	const handleCommand = (index) => {
		const selectedPerson = tagList[index];
		command({ id: selectedPerson.url, label: selectedPerson.name });
	};

	const [hoverIndex, setHoverIndex] = useState(0);
	useImperativeHandle(ref, () => ({
		onKeyDown: ({ event }) => {
			const { key } = event;

			if (key === "ArrowUp") {
				setHoverIndex((prev) => {
					const beforeIndex = prev - 1;
					return beforeIndex >= 0 ? beforeIndex : 0;
				});
				return true;
			}

			if (key === "ArrowDown") {
				setHoverIndex((prev) => {
					const afterIndex = prev + 1;
					const peopleCount = tagList.length - 1 ?? 0;
					return afterIndex < peopleCount ? afterIndex : peopleCount;
				});
				return true;
			}

			if (key === "Enter") {
				handleCommand(hoverIndex);
				return true;
			}

			return false;
		},
	}));

	const [el, setEl] = useState(null);
	const { styles, attributes } = usePopper(referenceEl, el, {
		placement: "bottom-start",
	});

	return createPortal(
		<div ref={setEl} className="mentionsContainer" style={styles.popper} {...attributes.popper}>
			{tagList.map((tag, index) => (
				<MentionItem key={tag.url} isActive={index === hoverIndex} onMouseEnter={() => setHoverIndex(index)} onClick={() => handleCommand(index)}>
					{tag.name}
				</MentionItem>
			))}
		</div>,
		document.body
	);
});
