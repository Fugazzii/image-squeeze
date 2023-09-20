import "./styles/rain.css";
import { useState, useEffect } from "react";
import { Waves } from "@src/components";

export function RainContainer({ children }: any) {
    const [raindrops, setRaindrops] = useState<Array<JSX.Element>>([]);

    const makeItRain = () => {
        let newRaindrops = [];
        let increment = 0;

        while (increment < 100) {
            const randoHundo = Math.floor(Math.random() * 98) + 1;
            const randoFiver = Math.floor(Math.random() * 4) + 2;
            increment += randoFiver;

            newRaindrops.push(
                <div
                    key={increment}
                    className='drop'
                    style={{
                        left: `${increment}%`,
                        bottom: `${randoFiver + randoFiver - 1 + 100}%`,
                        animationDelay: `0.${randoHundo}s`,
                        animationDuration: `0.5${randoHundo}s`,
                    }}
                >
                    <div
                        className='stem'
                        style={{
                            animationDelay: `0.${randoHundo}s`,
                            animationDuration: `0.5${randoHundo}s`,
                        }}
                    ></div>
                    <div
                        className='splat'
                        style={{
                            animationDelay: `0.${randoHundo}s`,
                            animationDuration: `0.5${randoHundo}s`,
                        }}
                    ></div>
                </div>,
            );
        }

        setRaindrops(newRaindrops);
    };

    useEffect(() => {
        makeItRain();
    }, []);

    return (
        <div className='login-container'>
            <div className='rain front-row'>{raindrops}</div>
            <div className='rain back-row'>{raindrops}</div>

            {children}

            <Waves />
        </div>
    );
}
