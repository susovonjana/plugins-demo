import "./App.css";
import CkeditorComponent from "./CkeditorComponent";
import QuillDemo from "./quillDemo";
import CkeditorComponent1 from "./withOutMentionCkeditor";
import QuillMentionExample from "./quillMentionExample";

function App() {
	return (
		<div className="App">
			<h1>Plugins Demo</h1>
			{/* <CkeditorComponent /> */}
			{/* <CkeditorComponent1 /> */}
			<QuillDemo />
			{/* <QuillMentionExample /> */}
			{/* <input type="text" id="editor" /> */}
		</div>
	);
}

export default App;
