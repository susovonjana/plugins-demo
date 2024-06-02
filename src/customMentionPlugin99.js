// CkeditorComponent.js
import React, { useEffect, useState } from "react";
import { CKEditor } from "ckeditor4-react";
import Select from "react-select";

const CkeditorComponent = () => {
	const [viewData, setData] = useState("");

	const handleEditorChange = (event) => {
		setData(event.editor.getData());
	};
	// for tag plugin
	let tempPHIndv = {
		organization: {
			organization_logo: "Logo",
			organization_name: "Name",
			user_name: "Susovon",
		},
		payment: {
			transaction_number: "Payment Number",
			amount: "Amount",
			issue_date: "Issue Date",
		},
	};
	// for tag plugin convert key to value
	let place_holder_data = {
		"{{user_name}}": "Susovon",
		"{{organization_logo}}": "Org Logo",
		"{{organization_name}}": "Org Name",
		"{{transaction_number}}": "Payment Number",
		"{{amount}}": "Amount",
		"{{issue_date}}": "Issue Date",
		"#current_year": "2024",
		"#client_type": "Client Type",
		"#period": "Period",
		"#prior_year": "2023",
	};

	// for mention plugin
	let mention_tag_array = [
		{
			id: 1,
			title: "current year",
			tag: "#current_year",
			value: "current year",
			label: "Current Year",
		},
		{
			id: 2,
			title: "client type",
			tag: "#client_type",
			value: "client type",
			label: "Client Type",
		},
		{
			id: 3,
			title: "period",
			tag: "#period",
			value: "period",
			label: "Period",
		},
		{
			id: 4,
			title: "prior year",
			tag: "#prior_year",
			value: "prior year",
			label: "Prior Year",
		},
	];

	// for mention plugin
	function dataFeed(opts, callback) {
		var matchProperty = "value",
			data = mention_tag_array?.filter(function (item) {
				return item[matchProperty]?.indexOf(opts.query?.toLowerCase()) === 0;
			});

		data = data.sort(function (a, b) {
			return a[matchProperty]?.localeCompare(b[matchProperty], undefined, {
				sensitivity: "accent",
			});
		});

		callback(data);
	}

	// common code for ckeditor
	function addRichCombo(editor, comboName, label, title, initFunction) {
		editor.ui.addRichCombo(comboName, {
			label: label,
			title: title,
			toolbar: "basicstyles,0",
			panel: {
				css: [
					"https://cdn.ckeditor.com/4.16.2/standard-all/skins/moono-lisa/editor.css?t=L7C8",
					"https://cdn.ckeditor.com/4.4.0/standard/contents.css?t=E3OD",
					"./styles.css",
				],
				multiSelect: false,
				attributes: { "aria-label": "Insert Placeholder" },
			},
			init: initFunction,
			onClick: function (value) {
				editor.focus();
				editor.fire("saveSnapshot");
				editor.insertHtml(value);
				editor.fire("saveSnapshot");
			},
		});
	}

	return (
		<div>
			<h2>CKEditor 4 in React</h2>
			<CKEditor
				config={{
					extraAllowedContent: "*{*}",
					allowedContent: true,
					// removeButtons: "Image Flash Table",
					// contentsLangDirection: "rtl",
					extraPlugins: ["font", "mentions"],
					toolbar: [
						{ name: "basicstyles", items: ["Bold", "Italic", "Underline"] },
						{ name: "paragraph", items: ["NumberedList", "BulletedList"] },
						{ name: "insert", items: ["tag_list", "file_list", "doc_list", "TagSearch"] },
					],
					mentions: [
						{
							feed: dataFeed,
							marker: "#",
							itemTemplate: '<li data-id="{id}"><span class="fullname">{title}</span></li>',
							outputTemplate: '<a href="https://www.google.com">{tag}</a><span>&nbsp;</span>',
							// outputTemplate: "<a href="/profile/{id}">{tag}</a><span>&nbsp;</span>",
							minChars: 0,
						},
					],
				}}
				name="ck_editor_name"
				onChange={handleEditorChange}
				initData="<p>This is an example CKEditor 4</p>"
				onPluginsLoaded={(args) => {
					const editor = args.editor;

					addRichCombo(editor, "tag_list", "Tag list", "Tag list", function () {
						Object.entries(tempPHIndv).forEach((entry) => {
							const [key, value] = entry;
							this.startGroup(key);
							Object.entries(value).forEach((entryInner) => {
								const [key, value] = entryInner;
								this.add("{{" + key + "}}", value);
								// this.add("{{" + key + "}}", selectBox(value));
							});
						});
					});

					editor.on("blur", function () {
						let data = editor.getData();
						// Replace each placeholder with its value
						// const shouldReplaceR = Object.values(place_holder_data).some((value) => data.includes(value));
						// if (shouldReplaceR) {
						for (let placeholder in place_holder_data) {
							let value = place_holder_data[placeholder];
							data = data.replace(`${placeholder}`, value);
						}
						editor.setData(data);
						// }
					});
					// you want to replace only the values that are present in the editor, you can use the following code:
					// also for jump editor
					editor.on("focus", function () {
						let data = editor.getData();
						let shouldReplace = Object.values(place_holder_data).some((value) => data.includes(value));
						if (shouldReplace) {
							for (let placeholder in place_holder_data) {
								let value = place_holder_data[placeholder];
								data = data.replace(value, `${placeholder}`);
							}
							editor.setData(data);
						}
					});
				}}
			/>

			<h3>Editor Content</h3>
			<div dangerouslySetInnerHTML={{ __html: viewData }} />
		</div>
	);
};

export default CkeditorComponent;

// final don't remove
