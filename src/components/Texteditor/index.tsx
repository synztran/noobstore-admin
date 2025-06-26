import { useState, lazy, Suspense } from "react";
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = lazy(() => import("react-quill-new"));

interface IProps {
	label?: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
	onBlur?: () => void;
	errorMessage?: string;
	note?: string;
	maxContent?: number;
	id?: string;
	rows?: number; // Add rows prop for configuring default lines
}

const TextEditor: React.FC<IProps> = (props) => {
	const {
		value,
		onChange,
		placeholder = "",
		label = "",
		className,
		onBlur,
		note = "",
		maxContent = 0,
		id = "",
		rows = 4, // Default to 4 rows
	} = props;

	const [charCount, setCharCount] = useState(value.length);

	// Calculate height based on rows (approximately 20px per row + padding)
	const editorHeight = rows * 20 + 40; // 40px for padding and borders

	return (
		<div className={`${className}`}>
			<div className="flex justify-between items-center">
				{label ? (
					<label className="text-gray-500">{label}</label>
				) : null}

				{maxContent > 0 ? (
					<p className="text-gray-500 ml-auto">
						{charCount}/{maxContent}
					</p>
				) : null}
			</div>
			{/* <Suspense fallback={<div>Loading...</div>}> */}
			<ReactQuill
				id={id}
				value={value}
				onChange={(value, _, __, editor) => {
					onChange(value);
					setCharCount(editor.getLength() - 1);
				}}
				placeholder={placeholder}
				theme="snow" // Use the "snow" theme for a clean toolbar
				modules={{
					toolbar: [
						[{ header: [false, 1, 2, 3, 4, 5, 6] }],
						[{ font: [] }],
						[{ color: [] }],
						[{ background: [] }],
						["bold", "italic", "underline"],
						["link", "image"],
						[{ list: "ordered" }, { list: "bullet" }],
					],
				}}
				onBlur={onBlur ? onBlur : () => {}}
				// style={{
				// 	height: `${editorHeight}px`,
				// }}
			/>

			<div className="flex justify-between items-center mt-2">
				{note ? <p className="italic text-gray-500">*{note}</p> : null}
			</div>
			{props.errorMessage && (
				<p className="text-red-500 text-sm mt-[3px] ml-[14px]">
					{props.errorMessage}
				</p>
			)}
			{/* </Suspense> */}
		</div>
	);
};

export default TextEditor;
