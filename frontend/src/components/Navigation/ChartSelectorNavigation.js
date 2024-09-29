import React from "react";
import styled from "styled-components";
import { chartSelectorItems } from "../../utils/chartSelectorItems";

const key = 0;

function ChartSelectorNavigation({ active, setActive }) {
    return (
            <ChartNavStyled>
                <ul className="menu-items">
                    {chartSelectorItems.map((item) => (
                        <li
                            key={item.id}
                            onClick={() => setActive(item.id)}
                            className={active === item.id ? 'active' : 'inactive'}
                        >
                            <span>{item.title}</span>
                        </li>
                    ))}
                </ul>
            </ChartNavStyled>
    );
}



const ChartNavStyled = styled.nav`
width: 100%;
    .menu-items{
        margin: 0;
        padding: 0rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
        background: #000000;
        border-radius: 20px 20px 0px 0px;

        li{
            display: flex;
            color: #2497d4;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            text-align: center;
            font-weight: 200;
            cursor: pointer;
            width: 50%;
            padding: 2rem;
        }
    }
    .inactive{
        border-bottom: 5px solid #2497d4;
    }
    .active{
        align-items: center;
        color: #FFFFFF !important;
        background: #000000;
        border-top: 5px solid #2497d4;
        border-left: 5px solid #2497d4;
        border-right: 5px solid #2497d4;
        border-radius: 20px 20px 0px 0px;
    }
`;

export default ChartSelectorNavigation