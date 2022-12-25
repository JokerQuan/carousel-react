# A fluent carousel by pure react + ts

## Props
| name | type | default value | description |
|------|------|---------------|-------------|
| width | string \| number | "auto" | carousel width, supprt vw, px, % |
| height | string \| number | "auto" | carousel height, supprt vw, px, % |
| pauseDuration | number | 2000 | pause time for autoplay<br>unit: ms |
| slideDuration | number | 1000 | the duration of the sliding animation<br>unit: ms |
| direction | 1 \| -1 | 1 | slide order<br>1: increment by child element subscript<br>-1: reverse
| pauseOnHover | boolean | true | pause autoplay when mouse hover |
| autoPlay | boolean | true | autoplay |
| tweenAnime | "linear"\|<br>"ease"\|<br>"ease-in"\|<br>"ease-out"\|<br>"ease-in-out"\|<br>"bounce"\|<br>Function | "ease" | item slide tween animation, you can set custom animation functions |
| navButton | boolean | true | enable navigator button |
| bottomCursor | boolean | true | enable bottom cursor |
| bottomCursorColor | string | "#ffffff" | bottom cursor color |
| bottomCursorActiveColor | string | "#1677ff" | bottom actived cursor color |
| draggable | boolean | true | enable mouse drag to slide |
| dragthreshold | number | 150 | threshold for slide distanse<br>uint: px |
| orientation | "horizontal" \| "vertical" | "horizontal" | slide orientation |
| onItemClick | function(item) | null | callback when item clicked |