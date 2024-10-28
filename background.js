chrome.runtime.onInstalled.addListener(() => {
  keepTabsActive();
});

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.message === 'closeTab' && sender.tab.id) {
    setTimeout(() => {
      chrome.tabs.remove(sender.tab.id);
    }, 500); // Delay to ensure print dialog has closed
  }
});

chrome.action.onClicked.addListener(async () => {
  try {
    let tabs = await chrome.tabs.query({});
    tabs.forEach((tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: printAndClosePage
      });
    });
  } catch (error) {
    console.error('Failed to print tabs:', error);
  }
});

function keepTabsActive() {
  setInterval(async () => {
    let tabs = await chrome.tabs.query({});
    tabs.forEach((tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: function() {
          console.log('Keeping tab active');
          document.body.innerHTML += ''; // Modify the DOM slightly to keep the tab active
        }
      });
    });
  }, 60000); // Interact with each tab every 60 seconds
}

function printAndClosePage() {
  const beforePrint = () => {
    console.log('Printing...');

    // Change hex code colors for better print results
    document.querySelectorAll('*').forEach(element => {
      if (window.getComputedStyle(element).color === 'rgb(246, 246, 246)') {
        element.style.color = '#ffffff';
      }
      if (window.getComputedStyle(element).backgroundColor === 'rgb(246, 246, 246)') {
        element.style.backgroundColor = '#ffffff';
      }
      if (window.getComputedStyle(element).color === 'rgb(140, 140, 140)') {
        element.style.color = '#000000';
      }
      if (window.getComputedStyle(element).backgroundColor === 'rgb(140, 140, 140)') {
        element.style.backgroundColor = '#000000';
      }
      if (window.getComputedStyle(element).color === 'rgb(250, 250, 250)') {
        element.style.color = '#ffffff';
      }
      if (window.getComputedStyle(element).backgroundColor === 'rgb(250, 250, 250)') {
        element.style.backgroundColor = '#ffffff';
      }
      if (window.getComputedStyle(element).color === 'rgb(51, 51, 51)') {
        element.style.color = '#000000';
      }
      if (window.getComputedStyle(element).backgroundColor === 'rgb(51, 51, 51)') {
        element.style.backgroundColor = '#000000';
      }
      if (window.getComputedStyle(element).color === 'rgb(102, 102, 102)') {
        element.style.color = '#000000';
      }
      if (window.getComputedStyle(element).backgroundColor === 'rgb(102, 102, 102)') {
        element.style.backgroundColor = '#000000';
      }
      if (window.getComputedStyle(element).color === 'rgb(64, 64, 64)') {
        element.style.color = '#000000';
      }
      if (window.getComputedStyle(element).backgroundColor === 'rgb(64, 64, 64)') {
        element.style.backgroundColor = '#000000';
      }
      if (window.getComputedStyle(element).color === 'rgb(186, 186, 186)') {
        element.style.color = '#000000';
      }
      if (window.getComputedStyle(element).backgroundColor === 'rgb(186, 186, 186)') {
        element.style.backgroundColor = '#000000';
      }
    });
  };

  const afterPrint = () => {
    chrome.runtime.sendMessage({ message: 'closeTab' });
  };

  // Smooth scroll function
  const smoothScroll = (targetPosition, duration) => {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = currentTime => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    const ease = (t, b, c, d) => {
      t /= d;
      return -c * t * (t - 2) + b;
    };

    requestAnimationFrame(animation);
  };

  // Scroll to the bottom of the page with smooth scroll
  const scrollToBottom = () => {
    return new Promise(resolve => {
      const totalHeight = document.body.scrollHeight;
      const scrollHeight = window.innerHeight;
      let position = 0;

      const scrollStep = () => {
        if (position < totalHeight - scrollHeight) {
          smoothScroll(position + scrollHeight, 2000);
          position += scrollHeight;
          setTimeout(() => {
            setTimeout(scrollStep, 2000); // Pause for 2 seconds
          }, 2000); // Wait for the scroll duration
        } else {
          resolve();
        }
      };

      scrollStep();
    });
  };

  window.addEventListener('beforeprint', beforePrint);
  window.addEventListener('afterprint', afterPrint);

  // Scroll to the bottom and then print
  scrollToBottom().then(() => {
    window.print();
  });
}
