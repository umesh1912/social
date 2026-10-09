# Unified social messaging app

_Started 2026-10-07 05:35 UTC_

---

## User

Design a mobile app for social media that is combination of whatsapp and Facebook that include linked in type of things as well, but different way.

## Assistant



## Assistant

_[tool: ask_user]_

I've put up a short form covering the core concept, which screens to include, who it's for, which professional features you want, and how you'd like the output. Once you submit it I'll start designing, and anything you leave blank I'll decide myself.

## User

Answered — concept: One identity, switchable modes (Personal / Work); screens: Onboarding, Home feed, Chats list, Chat thread, Group / community, Profile (personal + professional), Jobs / opportunities, Create post, Notifications, Stories / status, Calls, Search / discover; audience: General public; differentiator: Skills & endorsements, Portfolio / work samples, Job & gig posts, Mentorship requests, Verified work identity, Privacy split between friends and colleagues; fidelity: Clickable prototype; variations: One strong direction; platform: iOS

## Assistant

_[tool: list_files]_

_[tool: copy_starter_component]_

_[tool: list_files]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: update_todos]_

_[tool: dc_write]_

_[tool: show_html]_

_[tool: ready_for_verification]_

I've built **Duo** as a clickable iOS prototype in `Duo App.dc.html`. It's a background check is still reviewing it.

You have one account with a Personal / Work switch at the top. Switching changes the feed, stories, chats, calls, the third tab (Groups in Personal, Jobs in Work) and how your profile looks.

What you can do in it:
- **Onboarding:** 3 steps (welcome, your name and phone, then your work identity with work-email verification).
- **Feed:** stories that play on their own, likes, saves, a job card inside a post, and a composer where you pick who sees each post: Friends, Colleagues or Everyone.
- **Chats:** working message threads with replies, groups with Chat and Posts tabs, a calls list and a call screen.
- **Jobs:** filters for full-time, contract and gigs, plus apply or send a proposal, referral hints and a row for requesting a mentor.
- **Discover:** search people, groups and jobs. You add each person as a Friend or connect as a Colleague.
- **Profile:** preview it "as Friends" or "as Colleagues", with skills and endorsements, portfolio, verified badge, an "open to mentoring" toggle and a note listing what each side can't see.
- **Notifications:** accept mentorship requests, endorse people back and join groups.

The panel on the left jumps straight to any screen. Two settings: which mode it starts in, and whether to skip onboarding.

All images are striped placeholders, and the name "Duo" is a placeholder too, since you didn't give one.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I fixed both problems the check found:
- **Status bar:** the time, signal and battery now stay visible on every overlay screen (onboarding, chat thread, group, notifications, compose, story and call).
- **Profile:** the stray "Airplane mode" label next to the "Open to mentoring" switch is gone.

The page loads with no errors. I skipped the full re-check because the fixes were small. An automatic layout check also flagged overlapping text, but that's the onboarding screen sitting on top of the home feed, which is how it's meant to work.

## User

Please use the better design, colored design system. better and uniqe experience. this design you provided is looks like more used flow. use real images

## Assistant

_[tool: run_script]_

_[tool: view_image]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: read_file]_

_[tool: dc_write]_

_[tool: delete_file]_

_[tool: ready_for_verification]_

I've built a colourful redesign as `Duo App v2.dc.html`; your first version is unchanged. It's out for a final check now.

- **Two colour themes:** Personal uses pinks, Work uses indigo. A round button in the middle of the bottom bar switches between them, with a colour-wipe transition, and the whole app re-colours.
- **Real photos:** stories, posts, photo albums, group covers, job cards, mentors, profile photos and image messages in chat. The scene photos are stock pictures saved into the project. The faces load from a free portrait site, so those need an internet connection.
- **Opportunities:** jobs come as a deck of cards. You skip, save or apply one at a time, and each card animates away.
- **Profile:** the card flips in 3D to show what friends see versus what colleagues see. The Work side has skill bars and a portfolio that scrolls sideways.
- **New details:** groups shown as photo cards, and an "active now" row in Chats. When you post, you pick the audience from three coloured cards. Search shows people as photo cards with separate Friend and Connect buttons, and stories play full-screen.

The colours go beyond the attached design system, which is almost all grey. I took them from the one gradient it includes, so they still belong to it. The photos are stock images standing in for real user content.

## User

can you add the feature to meet and show the people on any location find out the peoplare are aryound you to chat using some map things, start meeting say hi to theme in both persona. use the better and smaller font

## Assistant

_[tool: read_skill_prompt]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I've added a **Nearby** map in `Duo App v3.dc.html`; the earlier versions are unchanged. It's out for a final check now.

- **Map:** a real street map around Lake Merritt in Oakland. People nearby show as photo pins, inside a dashed circle about 650 m across, with your own location pulsing in the middle.
- **Both spaces:** in Personal you see friends and people open to meeting; in Work you see professionals open to coffee chats. Flipping the mode switch swaps the pins and colours.
- **Meet and say hi:** tap a pin or a card to see the person's status and distance. "Say hi" sends a greeting to their chat, they reply after a few seconds, and "Message" opens the chat.
- **Meetups:** a second view shows nearby meetups you can join, and "Start a meetup here" adds your own pin to the map.
- **Privacy:** a Visible/Hidden button controls whether people nearby can see you. Each space has its own setting.
- **Font:** I switched to Plus Jakarta Sans and made all text about 1–2 px smaller. This replaces Inter, the design system's font, because you asked for a different one.

Nearby now has a tab in the bottom bar, so your profile opens from your photo at the top right instead. The map and the people's photos load from the internet, so they need a connection.

## User

Found issues — fixing…

## Assistant

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

I fixed the Nearby map so the pins now update as you use it. A background check is running on the fix now.

Before, the map kept showing whatever it drew first. Now it redraws when you:
- switch between Personal and Work,
- flip between People and Meetups,
- select a pin (it grows and shows the "HI" badge after you say hi),
- join a meetup or toggle Visible/Hidden.

The same fix also makes chat threads scroll to the newest message reliably.

