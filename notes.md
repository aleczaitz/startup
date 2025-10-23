# CS 260 Notes

[My startup - Jorvo](https://startup.jorvo.link)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

My IP address is: 98.86.20.7

## Caddy

No problems worked just like it said in the [instruction](https://github.com/webprogramming260/.github/blob/main/profile/webServers/https/https.md).

## HTML

This part was pretty easy, I just had some trouble figuring out that when you deploy with the `deployFiles.sh` script, the last part where you put the service or the `-s` meant that was going to be the subdomain. I spent quite a bit of time firguring this part out when deploying the simon subdomain. I got it figured out though.

After figuring that part out, I decided I wanted to pivot from my sandbox project [parkpal](https://parkpal.co/), because I had already had made a lot of progress and I didn't want to have to worry about going backwards on that idea.

I settled on an idea that would help me get really familiar with websockets, since I'm not too familiar in that area. I landed on a real time typing speed game that you can play against your friends with.

After deciding on the idea I built out a rough wireframe design in excalidraw, and updated the contents of the readme with that. It was super fast laying out the skeleton html files since I'd had experience doing this before.

I realized after looking at the rubric that images and login placeholders were a requirement so I added those

## CSS

I realized that I could make the application a lot simpler that it was. I deleted the logs and the challenge pages, as I think it'd be best to just have the functionality of those in the home page. I also put the log in link inside of the log in button, just so their aren't two separate ones. It's less confusing that way.

I've worked with react and tailwind before, so it was super exhausting to have to go back to the old way of applying css rules, but I did it. Adding the responsive designs took a while too, but once I kind of got the hang of it it wasn't too bad. I chose to make 3 color variables to base the styling off of, that way if I ever want to change the logo all I have to do is change those variables and it will apply to the whole application. 

## React Part 1: Routing

This Part was probably the longest. It was nice to have the Simon app as a reference of how to convert to react, and once I got that down it wasn't too bad. I had never had experience converting regualar html to react/vite, only starting fresh with vite. I think it was good to get that experience of how React and Vite are actually built off of html though. After starting to convert everything, I realized my css was super jumbled and I needed to make everything more simple and unified. That took a while, and there were a couple of times where I realized two buttons, lists, or even whole pages were really similar so might as well make the css rules reusable accross the whole app.

After this step, I feel like I understand React a lot better and am more confident in how my project works. 

## React Part 2: Reactivity

- It took me a while to figure out that when you're passing a state setter or something else down to a function you need put it in brackets.
- I dug a little into why you would use an actual function definition or an arrow function, and the reason I found is that actual functions have the actual `this` keyword, making it so if you're calling the function in multiple instances, you can use that to do stuff that is unique to that instance
- When playing around with the differences between the `.then` chaining and `aysnc / await`, I feel like I like using the chaining over the other. I feel like it makes more sense to me, but it is nice in instances where I have code that I want to wait to excecute after an await without having to throw it in `.finaly()`
