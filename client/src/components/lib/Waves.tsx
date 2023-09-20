import "./styles/waves.css";

export function Waves() {
    return (
        <svg
            className='svg-waves'
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            viewBox='0 24 150 28'
            preserveAspectRatio='none'
            shapeRendering='auto'
        >
            <defs>
                <path
                    id='gentle-wave'
                    d='M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z'
                ></path>
            </defs>
            <g className='svg-waves__parallax'>
                <use xlinkHref='#gentle-wave' x='48' y='0'></use>
                <use xlinkHref='#gentle-wave' x='48' y='3'></use>
                <use xlinkHref='#gentle-wave' x='48' y='5'></use>
                <use xlinkHref='#gentle-wave' x='48' y='7'></use>
            </g>
        </svg>
    );
}