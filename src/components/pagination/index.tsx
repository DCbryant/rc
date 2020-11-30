import React, {
	useMemo,
	useState,
	useEffect,
	CSSProperties,
} from "react";
import styled from "styled-components";
import { color } from "../shared/styles";
import Button from "../button";
import { Icon } from "../icon";

const PageUl = styled.ul`
	display: flex;
	justify-content: center;
	align-items: center;
	& > li {
		list-style: none;
	}
	& button {
		border-radius: 6px;
		padding: 10px 8px;
	}
	& span {
		line-height: 13.6px;
		height: 13.6px;
		min-width: 18px;
	}
	& svg {
		height: 13.6px;
		width: 13.6px;
		vertical-align: bottom;
	}
`;

// 动态生成一个数组
function calculateMove(
	current: number,
	state: number[],
	totalPage: number
): number[] | null {
	let mid = Math.floor(state.length / 2);
	let arr;
	// 当前位置跟中间数的差距
	let minus = current - state[mid];
	// 当当前位置跟中间数相等的时候无需更新
	if (minus === 0) {
		arr = null;
	} else if (minus > 0) { // 当前位置大于中间数也就是点击右边的时候
		// 最后一个数
		let tmp = state[state.length - 1];
		// 群体加差值
		if (tmp + minus < totalPage) {
			arr = state.map((v) => v + minus);
		} else {
			if (tmp === totalPage) {
				arr = null;
			} else { // tmp + minus > totalPage 此时重新生成一个差值，totalPage - tmp，之前的差值超过总数了
				arr = state.map((v) => v + totalPage - tmp);
			}
		}
	} else { //当前位置小于中间数也就是点击左边的时候
		//负数
		// 第一个元素加差值 > 1就可以正常左移
		if (state[0] + minus > 1) {
			arr = state.map((v) => v + minus);
		} else {
			//边缘，看最大能减几
			if (state[0] === 1) {
				arr = null;
			} else {
				arr = state.map((v) => v - state[0] + 1);
			}
		}
	}
	return arr;
}

export type PaginationProps = {
	/** 每页显示多少条*/
	pageSize?: number;
	/** 默认显示第几页 */
	defaultCurrent?: number;
	/** 总共条数*/
	total: number;
	/** 分页条目最大显示长度 */
	barMaxSize?: number;
	/** 回调页数 */
	callback?: (v: number) => void;
	/** 外层style*/
	style?: CSSProperties;
	/**外层类名 */
	classnames?: string;
};

export function Pagination(props: PaginationProps) {
	const {
		pageSize,
		defaultCurrent,
		total,
		barMaxSize,
		callback,
		style,
		classnames,
	} = props;
	const [current, setCurrent] = useState(defaultCurrent!);
	const [state, setState] = useState<Array<number>>([]);
	const totalPage = useMemo(() => {
		// 99 / 10
		let number = Math.ceil(total / pageSize!);
		// 如果分页数大于最大分页数
		if (number > barMaxSize!) {
			let statetmp = new Array(barMaxSize).fill(1).map((_x, y) => y + 1);
			setState(statetmp);
			let arr = calculateMove(defaultCurrent!, statetmp, number);
			if (arr) {
				setState(arr);
			}
		} else {
			let statetmp = new Array(number).fill(1).map((_x, y) => y + 1);
			setState(statetmp);
			let arr = calculateMove(defaultCurrent!, statetmp, number);
			if (arr) {
				setState(arr);
			}
		}
		return number;
	}, [barMaxSize, defaultCurrent, pageSize, total]);
	useEffect(() => {
		if (callback) callback(current);
	}, [callback, current]);
	return (
		<PageUl style={style} className={classnames ? classnames : ""}>
			<li>
				<Button
					appearance="primaryOutline"
					disabled={current === 1 ? true : false}
					onClick={() => {
						if (state.length > 0) {
							if (state[0] > 1) {
								let statetmp = state.map((x) => x - 1);
								setState(statetmp);
								setCurrent(current - 1);
								let arr = calculateMove(
									current - 1,
									statetmp,
									totalPage
								);
								if (arr) {
									setState(arr);
								}
							} else if (current !== state[0]) { //state[0] = 1,即是current不为1
								setCurrent(current - 1);
								let arr = calculateMove(
									current - 1,
									state,
									totalPage
								);
								if (arr) {
									setState(arr);
								}
							}
						}
					}}
				>
					<Icon icon="arrowleft" color={color.primary}></Icon>
				</Button>
			</li>
			{state.map((x, i) => {
				return (
					<li key={i}>
						<Button
							appearance={
								current === x ? "primary" : "primaryOutline"
							}
							onClick={() => {
								setCurrent(x);
								let arr = calculateMove(x, state, totalPage);
								if (arr) {
									setState(arr);
								}
							}}
						>
							{x}
						</Button>
					</li>
				);
			})}
			<li>
				<Button
					appearance="primaryOutline"
					disabled={current === totalPage ? true : false}
					onClick={() => {
						if (state.length > 0) {
							if (state[barMaxSize! - 1] < totalPage) {
								let statetmp = state.map((x) => x + 1);
								setState(statetmp);
								setCurrent(current + 1);
								let arr = calculateMove(
									current + 1,
									statetmp,
									totalPage
								);
								if (arr) {
									setState(arr);
								}
							} else {
								if (current !== totalPage) {
									setCurrent(current + 1);
									let arr = calculateMove(
										current + 1,
										state,
										totalPage
									);
									if (arr) {
										setState(arr);
									}
								}
							}
						}
					}}
				>
					<Icon icon="arrowright" color={color.primary}></Icon>
				</Button>
			</li>
		</PageUl>
	);
}
Pagination.defaultProps = {
	pageSize: 10,
	defaultCurrent: 1,
	barMaxSize: 5,
	total: 1000,
};

export default Pagination;