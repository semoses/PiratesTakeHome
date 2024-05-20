Pitching App V2 just released!

This application is distinct from the first version in that its focus is javascript to visualize and display the pitching data (specifcially JS's D3 Library) with a focus on being dynamic and data-driven.

The main goal when desigining this app was to provide a front end that is agnostic to the data being fed in so that, in theory, it could be reused for any kind of pitching data from any pitcher.
The scales on the graphs adjust to the data itself, so there shouldn't be any annoying re-scaling to do when the data changes.
Also, the sizing of the content is all based on the viewport, so these visualiztions should look great on any screen size.
Addiitonally, there is a handy tooltip that displays the exact data points coordinates when the cursor hovers over it just to make it that much easier to get real-time insight into the data displayed.

The page itslef was built with HTML, CSS for styling, Javascript for the interactions, and Javascript's D3 library.

Testing in: Chrome, Edge, and Firefox as well as on a variety of screen sizes.

--

This is the readme for the Pitching App.

To view the Pitching App, download the repo, navigate to the PitchingApp folder once unzipped, and open the pitchingApp.html page in your browser.  Please ensure that you don’t move any of the graph images out of the PitchingGraphs folder.
Note: I tested with Google Chrome, Mozilla Firefox, and Microsoft Edge, so those are all suitable browsers.

As for technologies used, the page itself was built with HTML, CSS, and JavaScript and the graphs were generated using R. I included a markdown file of my R code within the PitchingApp folder.
Screenshots of the app itself are included in the AppScreenshots folder.

Happy Pitching!
