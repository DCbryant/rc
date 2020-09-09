import React, {
	PropsWithChildren,
	ReactNode,
	useMemo,
	useState,
	ReactElement,
	useEffect,
	useRef,
	TouchEvent,
	CSSProperties,
} from "react";
import styled from "styled-components";
import { color } from "../shared/styles";
import Radio from "../radio";


const Transition = styled.div<TransitionType>`
	${(props) =>
		!props.animatein &&
		props.direction === "left" &&
		`
		transform: translateX(${props.width}px);
		`}
	${(props) =>
		!props.animatein &&
		props.direction === "right" &&
		`
		transform: translateX(${-props.width}px);
	
		`}
	${(props) =>
		props.animatein &&
		props.direction === "left" &&
		`
		transform: translateX(0);
			transition: all ${props.delay / 1000}s ease;
		`}
	${(props) =>
		props.animatein &&
		props.direction === "right" &&
		`
		transform: translateX(0);
		transition: all ${props.delay / 1000}s ease;
		`}
`;

interface WrapperProps {
  viewportBoxshadow: string
}

const Wrapper = styled.div<WrapperProps>`
  box-shadow: ${props => props.viewportBoxshadow};
  padding: 10px;
  border-radius: 5px;
`;

export type CarouselProps = {
	/** 默认索引*/
	defaultIndex?: number;
	/** 轮播图高度 */
	height?: number;
	/** 是否自动播放 */
	autoplay: boolean;
	/** 自动播放延迟 */
	autoplayDelay: number;
	/** 翻页动画延迟 */
	delay?: number;
	/**  动画速度 1000是1秒 */
	animationDelay?: number;
	/** radio color */
	radioAppear?: keyof typeof color;
	/**自动播放时是否反向播放 */
	autoplayReverse?: boolean;
	/** touch事件滑动距离差值 */
	touchDiff?: number;
	/** wrapper 类名*/
	classname?: string;
	/** wrapper 样式 */
	style?: CSSProperties;
	/** box shadow属性 */
	viewportBoxshadow: string;
};

function currentSetMap (
  current: number,
  map: [number, number, number]
): [number, number, number] {
  let mid = map[1]
  if (mid === current) {
    return map
  } else if (mid < current) {
    return [mid, current, -1]
  } else {
    return [-1, current, mid]
  }
}

function mapToState (
  map: [number, number, number],
  children: ReactNode,
  totalLen: number
) {
  if (totalLen <= 1) {
    return [null, children, null];
  } else {
    return map.map(v => {
      if (v === -1) return null;
      let child = children as ReactNode;
      return child[v]
    })
  }
}

interface AnimationType {
	animatein: boolean;
	direction: "" | "left" | "right";
}
interface TransitionType extends AnimationType {
	delay: number;
	width: number;
}

function toMove (
  right: boolean,
  totalLen: number,
  indexMap: [number, number, number],
  setIndexMap: React.Dispatch<React.SetStateAction<[number, number, number]>>
) {
  let y
  if (right) {
    if (indexMap[1] < totalLen - 1) {
      y = indexMap[1] + 1
    } else {
      y = 0
    }
  } else {
    if (indexMap[1] === 0) {
      y = totalLen - 1
    } else {
      y = indexMap[1] - 1
    }
  }
  setIndexMap(currentSetMap(y, indexMap))
}

export function Carousel(props: PropsWithChildren<CarouselProps>) {
  const {
		defaultIndex,
		height,
		autoplayDelay,
		animationDelay,
		autoplay,
		delay,
		radioAppear,
		autoplayReverse,
		touchDiff,
		style,
		classname,
		children,
		viewportBoxshadow,
  } = props;
  

  const [state, setState] = useState<ReactNode[]>([])
  const [indexMap, setIndexMap] = useState<[number, number, number]>([
    -1, -1, -1,
  ]);
  const [animation, setAnimation] = useState<AnimationType>({
    animatein: true,
    direction: ""
  });

  const [bound, setBound] = useState<DOMRect>()

  const totalLen = useMemo(() => {
    let len: number
    if (Array.isArray(children)) {
      len = children.length
    } else {
      len = 1;
    }
    return len
  }, [children])

  useMemo(() => {
    let map: [number, number, number] = [-1, -1, -1];
    map[1] = defaultIndex!
    let res = mapToState(map, children, totalLen)
    setState(res)
    setIndexMap(map)
  }, [defaultIndex, children, totalLen])

  useEffect(() => {
    let child = children as ReactElement[]
    let timer: number
    if (child) {
      let tmp = indexMap.map(v => {
        return v !== -1 ? child[v] : null
      })
      let sign: boolean
      setState(tmp)

      if (indexMap[0] === -1 && indexMap[2] === -1) {
        return;
      } else if (indexMap[0] === -1) {
        sign = true
        setAnimation({animatein: false, direction: "right"})
      } else {
        sign = false
        setAnimation({animatein: false, direction: "left"})
      }

      timer = window.setTimeout(() => {
        if (sign) {
          setAnimation({ animatein: true, direction: "right" });
        } else {
          setAnimation({ animatein: true, direction: "left" });
        }
      }, delay!)

      return () => window.clearTimeout(timer)
    }
  }, [delay, indexMap, children])

  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const setBoundFunc = () => {
      if (ref.current) {
        let bounds = ref.current.getBoundingClientRect()
        setBound(bounds)
      }
    }
    setBoundFunc()
    const resizeFunc = () => {
      setBoundFunc()
    }
    window.addEventListener("resize", resizeFunc);
    return () => {
      window.removeEventListener("resize", resizeFunc)
    }
  }, [])

  useEffect(() => {
    let timer : number
    if (autoplay) {
      timer = window.setTimeout(() => {
        toMove(!autoplayReverse!, totalLen, indexMap, setIndexMap)
      }, autoplayDelay)
    }
    return () => window.clearTimeout(timer)
  }, [autoplay, autoplayDelay, indexMap, totalLen, autoplayReverse])

  const [start, setStart] = useState(0)
  const touchStart = (e: TouchEvent<HTMLDivElement>) => {
    setStart(e.touches[0].clientX)
  }
  const touchEnd = (e: TouchEvent<HTMLDivElement>) => {
    let end = e.touches[0].clientX
    let val = end - start
    let abs = Math.abs(val)
    if (abs > touchDiff!) {
      if (val > 0) {
        toMove(false, totalLen, indexMap, setIndexMap);
      } else {
        toMove(true, totalLen, indexMap, setIndexMap);
      }
    }
  }

  return (
		<Wrapper
			ref={ref}
			style={style}
			className={classname}
			viewportBoxshadow={viewportBoxshadow!}
		>
			<div
				style={{
					width: `100%`,
					height: `${height!}px`,
					overflow: "hidden",
					position: "relative",
					borderRadius: "10px",
					boxShadow: viewportBoxshadow,
				}}
				onTouchStart={touchStart}
				onTouchEnd={touchEnd}
			>
				<Transition
					animatein={animation.animatein}
					direction={animation.direction}
					delay={animationDelay!}
					width={bound?.width!}
				>
					<div
						style={{
							display: "flex",
							width: `${bound?.width! * 3}px`,
							position: "absolute",
							left: `${-bound?.width!}px`,
						}}
					>
						{state.map((v, i) => (
							<div
								key={i}
								style={{
									height: `${height!}px`,
									width: `${bound?.width}px`,
								}}
								aria-hidden={i === 1 ? false : true}
							>
								{v}
							</div>
						))}
					</div>
				</Transition>
			</div>
			<ul
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					overflow: "hidden",
				}}
			>
				{new Array(totalLen).fill(1).map((x, y) => {
					return (
						<li style={{ listStyle: "none" }} key={y}>
							<Radio
								label={`carousel ${y}`}
								appearance={radioAppear}
								hideLabel
								value={0}
								checked={y === indexMap[1]}
								onChange={() => {}}
								onClick={() => {
									let newMap = currentSetMap(y, indexMap);
									setIndexMap(newMap);
								}}
							/>
						</li>
					);
				})}
			</ul>
		</Wrapper>
	);
}