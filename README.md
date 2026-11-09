# This is my takeaway on using ai agents for automated testing.

AI is allegedly modern day remedy for everything, so I decided to give it a go and help me generate some tests based on my requirements.

I was playing with AI agents for automated testing in playwright. My initial goal was to experiment on how precise and accurate AI would write tests for [QA Playground](https://qaplayground.com/). It has decent amount bells and whistles for automation engineer to play with,

also includes Test Cases in each practice element, the job would not be that hard for AI, isn't it?.

So, let's generate tests for Forms page. It has enough diversity of every day forms we encounter on the web. Prompt is simple:

> "Open the [QA Playground Forms](https://qaplayground.com/practice/forms), based on "Practice Elements" tab and "Test Cases" tabs, generate tests."

AI agents are good at scraping information and using all tools possible to deliver predicted results. It uses built-in chromium driver, redirects to given url and starts crawling website data, html locators, test cases and yada yada. About 20 minutes after it generates full test suite and starts it for me.

Everything is awesome, even webkit tests are failing and AI agent fixing them. Sometime after all tests are passed and greenlit, I hit accept. Now comes the *fun* part. Is to code review and validate the tests.

Going through almost each test case, I was questioning AI's decision. It already forgot to finish a 1\4 of a first test case, completely leaving Address Form, even tho, test case clearly states to fill in the detes. It hardcoded data and results, which may lead to unreliable tests in production (but, ok, I get it, it's just a playground website.).

For "Reset Fields" test it went through each and every form to fill in and then reset the fields. Even when test asked to do it once for Personal Form. For radio buttons it also did excessive work, adding click assertion for another radio button, not asked for. Same for checkboxes.

Then AI writes completely wrong test case, testing wrong Form Field. Instead of going for Account Setup Form, it asserts components in Login Form, followed by checking for page error instead of console errors.

It spent **4.2m input tokens, 29k output tokens and 6.7 credits** on gpt-6-luna. It's relatively cheap, but results are underwhelming and I have to spend time babysitting AI, correcting it's results. It consumes time and in result it might be better if I wrote tests myself.

I leave AI driven tests as an example when AI might show good results, even tho it's wrong. **You are not a vibe tester. Always validate the work it does.**

In my opinion, it's nice to have a fast machine helping you out, but my best guess is to write tests yourself and use ai assistance as brainstorming, researching or automation layer where you definitely sure it won't mess up.
