import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import type {
	DropResult,
	DroppableProvided,
	DraggableProvided,
	DroppableStateSnapshot,
	DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { Plus, Trash2 } from "lucide-react";

interface IProps {
	formik: any;
}

const CollapseContentEditor = ({ formik }: IProps) => {
	console.log("content collapse", formik.values.collapseContent);
	const addNewEditor = () => {
		const newContent = [...(formik.values.collapseContent || [])];
		newContent.push({ title: "", content: "" });
		formik.setFieldValue("collapseContent", newContent);
	};

	const removeEditor = (index: number) => {
		const newContent = [...(formik.values.collapseContent || [])];
		newContent.splice(index, 1);
		formik.setFieldValue("collapseContent", newContent);
	};

	const onDragEnd = (result: DropResult) => {
		if (!result.destination || typeof result.destination.index !== "number")
			return;

		const items = Array.from(formik.values.collapseContent);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem as number);

		formik.setFieldValue("collapseContent", items);
	};

	return (
		<div className="space-y-4 mt-2">
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="editors">
					{(
						provided: DroppableProvided,
						snapshot: DroppableStateSnapshot
					) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}>
							{formik.values.collapseContent.map(
								(
									item: { title: string; content: string },
									index: number
								) => (
									<Draggable
										key={index}
										draggableId={`editor-${index}`}
										index={index}>
										{(
											provided: DraggableProvided,
											snapshot: DraggableStateSnapshot
										) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												className="relative mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
												<div
													{...provided.dragHandleProps}
													className="absolute top-2 left-2 cursor-move">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round">
														<line
															x1="8"
															y1="6"
															x2="21"
															y2="6"
														/>
														<line
															x1="8"
															y1="12"
															x2="21"
															y2="12"
														/>
														<line
															x1="8"
															y1="18"
															x2="21"
															y2="18"
														/>
														<line
															x1="3"
															y1="6"
															x2="3.01"
															y2="6"
														/>
														<line
															x1="3"
															y1="12"
															x2="3.01"
															y2="12"
														/>
														<line
															x1="3"
															y1="18"
															x2="3.01"
															y2="18"
														/>
													</svg>
												</div>
												<div className="pl-8">
													<div className="form-control w-full">
														<label className="label">
															<span className="label-text">
																Tiêu đề
															</span>
														</label>
														<input
															type="text"
															className="input input-bordered w-full"
															value={
																item.title || ""
															}
															onChange={(
																e: React.ChangeEvent<HTMLInputElement>
															) => {
																const newContent =
																	[
																		...(formik
																			.values
																			.collapseContent ||
																			[]),
																	];
																newContent[
																	index
																] = {
																	...(typeof newContent[
																		index
																	] ===
																		"object" &&
																	newContent[
																		index
																	] !== null
																		? newContent[
																				index
																		  ]
																		: {
																				title: "",
																				content:
																					"",
																		  }),
																	title: e
																		.target
																		.value,
																};
																formik.setFieldValue(
																	"collapseContent",
																	newContent
																);
															}}
														/>
													</div>
													<div className="form-control w-full mt-4">
														<label className="label">
															<span className="label-text">
																Nội dung
															</span>
														</label>
														<textarea
															className="textarea textarea-bordered w-full"
															rows={4}
															value={
																item.content ||
																""
															}
															onChange={(
																e: React.ChangeEvent<HTMLTextAreaElement>
															) => {
																const newContent =
																	[
																		...(formik
																			.values
																			.collapseContent ||
																			[]),
																	];
																newContent[
																	index
																] = {
																	...(typeof newContent[
																		index
																	] ===
																		"object" &&
																	newContent[
																		index
																	] !== null
																		? newContent[
																				index
																		  ]
																		: {
																				title: "",
																				content:
																					"",
																		  }),
																	content:
																		e.target
																			.value,
																};
																formik.setFieldValue(
																	"collapseContent",
																	newContent
																);
															}}
														/>
													</div>
												</div>
												<button
													className="btn btn-circle btn-sm absolute -top-3 -right-3 bg-white border border-black text-red-400 hover:bg-red-50"
													onClick={() =>
														removeEditor(index)
													}>
													<Trash2 size={16} />
												</button>
											</div>
										)}
									</Draggable>
								)
							)}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
			<button className="btn btn-primary" onClick={addNewEditor}>
				<Plus size={16} className="mr-2" />
				Thêm nội dung
			</button>
		</div>
	);
};

export default CollapseContentEditor;
