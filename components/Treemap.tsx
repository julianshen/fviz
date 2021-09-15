import { useEffect, useRef } from "react";
import * as d3 from 'd3';
import { HierarchyRectangularNode } from "d3";
import { Box } from "@material-ui/core";

type TradeData = {
    Code: string;
    Name: string;
    TradeVolume: number;
    Transaction: number;
    TradeValue: number;
    OpeningPrice: number;
    HighestPrice: number;
    LowestPrice: number;
    ClosingPrice: number;
    Change: string;
    Time: string;
}

type StockData = {
    name: string;
    data: TradeData;
    value?: number;
    children?: StockData[];
}

function ccolor(data: StockData):string {
    var change = Number(data.data.Change)
    var open = Number(data.data.OpeningPrice)
    if(isNaN(change) || open <= 0) {
        change = 0
    }

    if(change > 0.0) {
        const colorScale = d3.scaleSequential().domain([0,9]).interpolator(d3.interpolate("#803010", "#d01010"));
        return colorScale(change/open*100)
    }

    if(change < 0.0) {
        const colorScale = d3.scaleSequential().domain([0,9]).interpolator(d3.interpolate("#108030", "#10d010"));
        return colorScale(-1 * change/open*100)
    }             

    return "#a0a0a0";
}

const tooltip = ():d3.Selection<HTMLDivElement, unknown, HTMLElement, any> => {
    var Tooltip = d3.select<HTMLDivElement, unknown>(".tooltip");
    if(Tooltip.empty()) {
        return d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute");
    }

    return Tooltip;
}

const Treemap = (props: { width:number, height:number, date:Date }) => {
    const svgRef = useRef(null);
    
    const dataFile = "data/" + props.date.getFullYear() + "-" 
      + (props.date.getMonth() + 1).toString().padStart(2, "0") 
      + "-" + props.date.getDate().toString().padStart(2, "0") + ".json";

    const renderTreemap = async () => {
        const svg = d3.select(svgRef.current).style("font", "10px sans-serif");
        svg.attr('width', props.width).attr('height', props.height);
        svg.selectAll("*").remove();
        
        var stockData:StockData
        try {
            stockData = await d3.json(dataFile) as StockData;
        } catch(e) {
            svg.append("text")
                .text("本日無資料, 請按左上角按鈕選取時間")
                .attr("x", 6)
                .attr("y", 22)
                .attr("stroke", "white");
            return;
        }

        const prepareData = (s:StockData) => {
            if(s.children) {
                s.children.forEach(c => {
                    prepareData(c);
                });
            }

            if(s.data) {
                var val = Number(s.data.TradeVolume);
                val = isNaN(val) ? 0:val;
                s.value = (""+val).length;
            }
        }

        prepareData(stockData);

        const root = d3.hierarchy<StockData>(stockData).sum(d => {
            if(!d.value) {
                return 0;
            }

            return Number(d.value);
        }).sort((a, b) => {
            if(a.data.data && b.data.data) {
                return b.data.data.TradeValue - a.data.data.TradeValue
            }
            return 0
        });

        d3.treemap()
        .size([props.width, props.height])
        .paddingOuter(3)
        .paddingTop(19)
        .paddingInner(1)
        .round(true)
        (root)

        const mouseOver = (event:any, dataNode:d3.HierarchyNode<StockData>) => {
            var changeText = dataNode.data.data.Change;
                
            tooltip()
            .html(`
                <table width="100%" style="color:black;">
                    <tr >
                        <th>${dataNode.data.data.Code}</td>
                        <td rowspan="2">${dataNode.data.data.ClosingPrice}</td>
                        <td rowspan="2" style="border-width:1px;border-radius:5px;color:white;background-color: ${ccolor(dataNode.data)}">${changeText}</td>
                    </tr>
                    <tr>
                        <th style="font-size: 12px">${dataNode.data.data.Name}</td>
                    </tr>
                </table>
            `)
            .style("left", (event.pageX + 4) + "px")
            .style("top", (event.pageY + 4) + "px")
            .transition().duration(200).style("opacity", 0.9);
        }

        svg.selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr('x', d => { return (d as HierarchyRectangularNode<StockData>).x0; })
            .attr('y', d => { return (d as HierarchyRectangularNode<StockData>).y0; })
            .attr('width', d => { return (d as HierarchyRectangularNode<StockData>).x1 - (d as HierarchyRectangularNode<StockData>).x0; })
            .attr('height', d => { 
                    const h = (d as HierarchyRectangularNode<StockData>).y1 - (d as HierarchyRectangularNode<StockData>).y0; 
                    return h;
                })
            .style("stroke", "black")
            .style("fill", d => ccolor(d.data))
            .on('mouseover', (event, dataNode)=>{
                mouseOver(event, dataNode);
            }).on('mouseleave', () => {
                tooltip().style("opacity", 0);
            });

            svg
            .selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .attr("x", d => { return (d as HierarchyRectangularNode<StockData>).x0 + 1})    
            .attr("y", d => { return (d as HierarchyRectangularNode<StockData>).y0 + 7})   
            .text(d => { 
                if((d as HierarchyRectangularNode<StockData>).x1 - (d as HierarchyRectangularNode<StockData>).x0 < 20) {
                    return ""
                }
                
                if((d as HierarchyRectangularNode<StockData>).y1 - (d as HierarchyRectangularNode<StockData>).y0 < 8) {
                    return ""
                }

                return d.data.name
            })
            .attr("font-size", "8px")
            .attr("fill", "white")
            .on('mouseover', (event, dataNode)=>{
                mouseOver(event, dataNode);
            }).on('mouseleave', () => {
                tooltip().style("opacity", 0);
            });
        
        svg
            .selectAll("titles")
            .data(root.descendants().filter(d => d.depth<3))
            .enter()
            .append("text")
            .attr("x", d => { return (d as HierarchyRectangularNode<StockData>).x0 + 2})    // +10 to adjust position (more right)
            .attr("y", d => { return (d as HierarchyRectangularNode<StockData>).y0 + 16})    // +20 to adjust position (lower)
            .text(d => { return d.data.name})
            .attr("font-size", "10px")
            .attr("fill", "white")
    };

    useEffect(() => {
        renderTreemap();
    });
    
    return (
        <Box>
            <svg ref={svgRef} />
        </Box>
      );
}

export default Treemap