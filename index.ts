#!/usr/bin/env node
import blessed from 'blessed';

const screen = blessed.screen({
  smartCSR: true,
});

screen.title = 'my window title';

// Create a box perfectly centered horizontally and vertically.
var box = blessed.box({
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  content: 'Hello {bold}world{/bold}!',
  tags: true,
  border: {
    type: 'line',
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0',
    },
    hover: {
      bg: 'green',
    },
  },
});

// Append our box to the screen.
screen.append(box);

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch:any, key:any) {
  return process.exit(0);
});

//   // Focus our element.
box.focus();

//   // Render the screen.
screen.render();
