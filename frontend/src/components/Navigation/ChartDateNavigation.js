import React from "react";
import styled from "styled-components";
import { chartDateItems } from "../../utils/chartDateItems";

const key = 0;

function ChartDateNavigation({ active, setActive }) {
    return (
            <ChartNavStyled>
                <ul className="menu-items">
                    {chartDateItems.map((item) => (
                        <li
                            key={item.id}
                            onClick={() => setActive(item.id)}
                            className={active === item.id ? 'active' : ''}
                        >
                            <span>{item.title}</span>
                        </li>
                    ))}
                </ul>
            </ChartNavStyled>
    );
}



const ChartNavStyled = styled.nav`
border-left: 5px solid #2497d4;
border-bottom: 5px solid #2497d4;
border-right: 5px solid #2497d4;
border-radius: 0px 0px 20px 20px;
background: #000000;
width: 100%;
    .menu-items{
        display: flex;
        flex-direction: row;
        padding: 1rem;
        li{
            color: #73c1d3;
            display: flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            text-align: center;
            font-weight: 200;
            cursor: pointer;
            width: 50%;
            padding: 1rem;
        }
    }

    .active{
        color: #000000 !important;
        background: #73c1d3;
        box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        height: 50%;
    }
`;

export default ChartDateNavigation