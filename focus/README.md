当一个元素获得焦点是会触发 `focusin` 和 `focus` 事件，而当一个元素失去焦点时会触发 `focusout` 和 `blur` 事件。

`focusin` 和 `focusout` 事件的触发会在 `focus` 和 `blur` 事件之前，假设当前聚焦在元素 A，然后将焦点聚焦到了 B，那么触发的顺序是

```JavaScript
focusout(A) -> focusin(B) -> blur(A) -> focus(B)
```

二者的核心区别就在于是否支持冒泡：`focus/blur` 事件不支持冒泡，而 `focusin/focusout `事件支持冒泡，可以让父元素感知到内部焦点的变化。
