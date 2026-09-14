# Campus Watch

CAMPUS SECURITY INCIDENT REPORTING AND RESPONSE MANAGEMENT SYSTEM — MASTER APPLICATION PROMPT

Design and develop a modern, professional, secure, and user-friendly mobile application called:

Campus Security

Subtitle: Incident Reporting & Response System

The application is designed for a university or college campus environment. Its main purpose is to allow campus residents, including students and staff members, to quickly report security incidents or emergencies requiring security attention. Security officers must be able to receive, manage, prioritize, respond to, and resolve reported incidents.

The system must have three main user roles:

Resident Side — Students and Staff

Security Officer Side

Administrator Side

The application should have a modern, premium, professional security-focused design. Use a clean and minimal interface with a strong sense of safety and reliability.

DESIGN STYLE

Use:

Professional university/security application design

Modern mobile UI

Clean layout

Rounded cards

Smooth shadows

Clear icons

Dark navy blue as the primary color

White and light gray backgrounds

Red for Emergency/SOS actions

Green for successful/resolved incidents

Orange/yellow for warnings or delayed incidents

Clear typography

High-quality map integration

Bottom navigation where appropriate

Responsive layouts

Accessible buttons and readable text

Professional dashboard cards and statistics

The design should look like a real production-ready mobile application suitable for a university campus.

PART 1: WELCOME AND AUTHENTICATION

SCREEN 1: WELCOME / LOGIN SCREEN

Display:

Campus Security

Subtitle:

Incident Reporting & Response System

Include:

Campus/security shield logo

Email or Student/Staff Number input field

Password input field

Show/hide password button

Login button

Forgot Password link

"Don't have an account? Register" link

Below the login section, display a security/privacy message such as:

"Your safety is our priority. Report incidents quickly and securely."

The Login button should authenticate users and redirect them according to their account role:

Student → Resident Dashboard

Staff → Resident Dashboard

Security Officer → Security Dashboard

Administrator → Admin Dashboard

PART 2: APP LOCK SECURITY

After the user has successfully logged in previously, the application should allow them to remain signed in securely.

When the application is opened again, display an App Lock screen instead of requiring the full email and password login every time.

SCREEN: APP LOCK

Display:

Application logo

"Welcome Back"

User profile photo

"Unlock Campus Security"

Authentication options:

Option 1: PIN

Allow the user to create a secure 4-digit or 6-digit App Lock PIN.

Display:

Enter PIN

Numeric keypad

Delete button

Option 2: Biometric Authentication

Allow:

Fingerprint authentication

Face authentication

Face ID or Touch ID where supported by the device

Important:

The application must use the phone's built-in biometric authentication system. The application must NOT store actual fingerprint data or biometric templates.

Display:

Large fingerprint icon

"Use Fingerprint"

Alternative option: "Use PIN"

If supported: "Use Face ID"

PART 3: REGISTRATION ACCOUNT TYPE

SCREEN: REGISTER AS

Display:

"Create Your Campus Security Account"

Subtitle:

"Choose your account type"

Show two large selectable cards:

CARD 1: SECURITY OFFICER

Icon:

Security officer or shield icon

Text:

"Security Officer"

Description:

"Register as an authorized campus security officer."

Button:

"Register as Security Officer"

CARD 2: STUDENT / STAFF

Icon:

Graduation cap or university user icon

Text:

"Student / Staff"

Description:

"Register as a campus resident."

Button:

"Register as Student / Staff"

PART 4: SECURITY OFFICER REGISTRATION

SCREEN: SECURITY OFFICER REGISTRATION

Title:

"Security Officer Registration"

The registration form must include:

Full Name and Surname

Gender

Male

Female

Prefer not to say

Staff Number

Institutional Staff Email

Cellphone Number

ID/Face Photo

Password

Confirm Password

For the face photo:

Allow camera capture

Allow gallery upload

Display a circular profile photo preview

Include a security/privacy message

Add:

Register button

Already have an account? Login

After registration:

Display:

"Registration Submitted"

Message:

"Your Security Officer account will be reviewed and approved by the Campus Security Administrator before access is granted."

Account status:

Pending Approval

Approved

Rejected

Suspended

Security officers should not automatically gain access to security management features until approved by an administrator.

PART 5: STUDENT / STAFF REGISTRATION

SCREEN: STUDENT / STAFF REGISTRATION

Title:

"Student / Staff Registration"

Fields:

Full Name and Surname

Gender

Account Type

Student

Staff

Institutional Email

Student or Staff Number

Cellphone Number

ID/Face Photo

Password

Confirm Password

The system should verify:

Institutional email

Student/staff number

Account type

Include:

Register button

Login link

Privacy information

After registration:

Display:

"Account Created Successfully"

The user should receive an institutional email verification.

PART 6: EMAIL AND ACCOUNT VERIFICATION

SCREEN: VERIFY ACCOUNT

Display:

"Verify Your Account"

Message:

"We have sent a verification code to your institutional email."

Include:

6-digit verification code input

Verify button

Resend code button

After successful verification:

"Your account has been successfully verified."

PART 7: RESIDENT DASHBOARD

SCREEN: RESIDENT HOME DASHBOARD

Display:

Greeting:

"Good Morning, John Doe"

Show the user's profile photo.

The most important element should be a large red Emergency/SOS button.

EMERGENCY BUTTON

Large red button:

"EMERGENCY"

Subtitle:

"Tap for immediate security assistance"

When pressed:

Ask for confirmation

Automatically capture current GPS location

Mark the report as Critical priority

Immediately notify available security officers

Start the incident response workflow

Below the emergency button, display dashboard action cards:

Report Incident

Icon: Report/document

My Reports

Icon: History/document

Notifications

Icon: Bell

Emergency Contacts

Icon: Phone

Safety Tips

Icon: Shield

About

Icon: Information

Display an Active Report card when the user currently has an open incident.

Example:

Active Report

Incident ID: #INC-2026-007

Status: Responding

Location: Main Campus Residence

Show:

Status

Date/time

Incident category

Officer assignment

Small map preview

Bottom navigation:

Home

Reports

SOS

Contacts

Profile

PART 8: REPORT INCIDENT

SCREEN: REPORT INCIDENT

Title:

"Report Incident"

Fields:

Incident Type

Dropdown with categories:

Theft

Assault

Suspicious Activity

Medical Emergency

Fire

Damage to Property

Unauthorized Access

Disturbance

Other

Incident Description

Large text area:

"Describe what happened..."

Include character counter.

Incident Priority

Automatically calculated based on the category, but allow the system to display:

Critical

High

Medium

Low

Location

Provide two options:

Capture Live Location

Select/Pick Location on Map

Display:

Current GPS coordinates

Campus building/location name

Small map preview

Location pin

Additional Evidence

Allow optional:

Photo

Video

Additional notes

At the bottom:

Large button:

"SUBMIT REPORT"

Before submitting, display confirmation:

"Are you sure you want to submit this incident report?"

PART 9: LOCATION SELECTION

SCREEN: SELECT LOCATION

Display a large interactive map.

Features:

Current user location marker

Search location

Campus buildings

Security locations

Emergency locations

Draggable location pin

Confirm Location button

Display:

"Use Current Location"

and:

"Select Location Manually"

Button:

"CONFIRM LOCATION"

PART 10: INCIDENT SUCCESSFULLY SUBMITTED

SCREEN: INCIDENT SUBMITTED

Display:

Large green confirmation icon.

Message:

"Your report has been submitted successfully."

Show:

Incident ID

Incident category

Report date/time

Location

Priority level

Message:

"Campus Security has been notified. You will receive updates about your report."

Buttons:

View My Reports

Return Home

PART 11: INCIDENT STATUS TRACKING

SCREEN: REPORT STATUS

Allow residents to track incidents through a visual timeline.

Incident workflow:

Reported

Received

Officer Assigned

Responding

Arrived

Resolved / Unable to Resolve

Closed

Display:

Incident ID

Date/time

Current status

Officer information when assigned

Response time

Location

Timeline

Example:

Reported
✓ Completed

Received
✓ Completed

Officer Assigned
✓ Completed

Responding
● Current

Arrived
○ Pending

Resolved
○ Pending

Closed
○ Pending

Button:

"View Incident Details"

PART 12: PREVIOUS REPORTS

SCREEN: MY REPORTS

Display tabs:

All

Active

Resolved

Cancelled

Each incident card should display:

Incident ID

Incident category

Date/time

Location

Status

Priority

Resolution status

Example:

#INC-2026-007

Suspicious Activity

Location: Engineering Building

Status: Responding

Date: 28 August 2026

Clicking a report opens the full incident details.

PART 13: INCIDENT DETAILS

SCREEN: REPORT DETAILS

Display:

Incident Information

Incident ID

Category

Description

Priority

Date/time

Location

Map

Incident Status

Display current progress.

Security Officer Information

When an officer is assigned, display:

Officer name

Profile photo

Officer status

Assigned time

Do not expose unnecessary private officer information.

Resolution

When completed, display:

Resolution outcome

Action taken

Date/time resolved

Officer notes where appropriate

Display:

Response Time:

Example:

"Officer responded in 8 minutes."

PART 14: CANCEL ACTIVE REPORT

Residents should be able to cancel an active report under controlled conditions.

Display:

"Cancel Incident Report"

Require:

Confirmation

Reason for cancellation

Reasons:

Report submitted by mistake

Situation resolved

No longer require assistance

Other

Rules:

Cancellation is allowed before an officer arrives.

If an officer has already been dispatched or arrived, cancellation should require a confirmation and notify the assigned security officer.

Status should change to:

"Cancelled by Reporter"

PART 15: NOTIFICATIONS

SCREEN: NOTIFICATIONS

Display real-time notifications.

Examples:

Your incident report has been received.

Security Officer John Smith has been assigned.

A security officer is responding to your location.

The officer has arrived.

Your incident has been resolved.

Your report was cancelled.

Each notification should include:

Icon

Title

Description

Date/time

Read/unread status

PART 16: EMERGENCY CONTACTS

SCREEN: EMERGENCY CONTACTS

Display:

Campus Security

Call Security

Campus Emergency

Medical Emergency

Fire Department

Police

Each contact should have:

Name

Emergency number

Call button

The interface must make emergency calling fast and easy.

PART 17: SECURITY OFFICER DASHBOARD

SCREEN: SECURITY OFFICER HOME

Title:

"Officer Dashboard"

Display officer name and profile photo.

At the top display statistics:

Active Incidents

Emergency Incidents

Available Officers

Example:

Active Incidents: 3

Emergency: 1

Available Officers: 7

Below display:

Incoming Incidents

Each incident card should display:

Incident ID

Category

Priority

Time reported

Location

Distance

Reporter name where authorized

Example:

#INC-2026-008

Medical Emergency

Priority: Critical

Reported: 10 minutes ago

Location: Main Campus Residence

Buttons:

ACCEPT

DECLINE

When accepted:

Officer status changes to:

"Responding"

PART 18: SECURITY OFFICER AVAILABILITY

Security officers must manage their availability.

Available statuses:

Available

Occupied

Responding

Off Duty

Display a status selector.

The system should use officer availability when assigning incidents.

PART 19: INCIDENT MANAGEMENT — SECURITY OFFICER

SCREEN: INCIDENT DETAIL

Display:

Incident Information

Incident ID

Category

Priority

Description

Date/time

Reporter Information

Display:

Full name

Student/staff number

Cellphone number

Gender

Relevant incident history

The officer should only see information necessary for responding to the incident.

Location

Display:

Map

Live location where applicable

Campus building

Coordinates

Buttons:

View on Map

Navigate to Location

PART 20: SECURITY OFFICER INCIDENT WORKFLOW

The officer should be able to update the incident status.

Workflow:

Reported

↓

Received

↓

Assigned

↓

Responding

↓

Arrived

↓

Resolved / Unable to Resolve

↓

Closed

Actions:

Accept Incident

Start Responding

Mark as Arrived

Escalate Incident

Record Resolution

PART 21: INCIDENT RESOLUTION REPORT

SCREEN: RESOLUTION REPORT

After responding to the incident, the officer must complete a resolution form.

Fields:

Outcome

Dropdown:

Resolved

Unable to Resolve

False Alarm

Escalated

Other

What Happened?

Large description field.

Action Taken

Large description field.

Resolution

Large description field.

Date and Time Attended

Automatically captured.

Evidence

Optional:

Photos

Notes

Additional Notes

Optional.

Button:

"SUBMIT RESOLUTION REPORT"

PART 22: REPORTER HISTORY

Security officers should be able to view previous incidents reported by the particular resident.

Display:

Incident ID

Category

Date/time

Location

Status

Resolution

Include search and filtering.

This information should only be accessible to authorized personnel and must respect privacy requirements.

PART 23: SECURITY OFFICER INCIDENT HISTORY

SCREEN: INCIDENT HISTORY

Allow officers to search and filter incidents by:

Date

Location

Category

Status

Priority

Reporter

Officer

Display incident cards in a clean list.

PART 24: ADMINISTRATOR DASHBOARD

The Administrator side can be a mobile interface or web-based management dashboard.

Title:

"Campus Security Admin Dashboard"

Display summary cards:

Today's Incidents: 18

Active Incidents: 4

Resolved: 12

Emergency Incidents: 2

Available Officers: 7

Display:

Incident activity

Officer availability

Recent emergency reports

Response time statistics

Navigation:

Dashboard

Users

Officers

Incidents

Analytics

Reports

Settings

PART 25: USER MANAGEMENT

Administrator features:

View all students

View all staff

View user profiles

Activate accounts

Deactivate accounts

Suspend accounts

Edit user information

Search users

Verify accounts

Display:

Profile photo

Full name

Student/staff number

Email

Account status

PART 26: SECURITY OFFICER MANAGEMENT

Administrators must be able to:

Add officers

Approve officer registrations

Reject registrations

Activate/deactivate officers

Assign shifts

Monitor availability

View officer performance

View response times

Reassign incidents

Officer statuses:

Available

Responding

Occupied

Off Duty

PART 27: ADMIN INCIDENT MANAGEMENT

Administrators should be able to:

View all incidents

Monitor active incidents

Reassign incidents

Escalate serious incidents

Close incidents

Search incidents

Filter incidents

Review resolution reports

Filters:

Date

Category

Priority

Location

Status

Officer

Reporter

PART 28: INCIDENT PRIORITIZATION

The system must automatically prioritize incidents.

CRITICAL

Examples:

Assault

Weapon threat

Fire

Serious medical emergency

Action:

Immediate security notification and highest priority.

HIGH

Examples:

Theft

Suspicious person

Serious property damage

MEDIUM

Examples:

Minor disturbance

Unauthorized access

LOW

Examples:

Non-urgent security concerns

General safety concerns

Priority should be clearly displayed using appropriate visual indicators.

PART 29: RESPONSE TIME MONITORING

The system must automatically calculate response time.

Formula:

Response Time = Officer Arrival Time − Incident Report Time

Classify response performance:

On Time

Delayed

Critical Delay

The administrator should be able to configure expected response time limits.

Display response-time analytics for:

Individual officers

Incident categories

Campus locations

Daily/monthly statistics

PART 30: ANALYTICS AND REPORTS

The Administrator dashboard should provide analytics such as:

Number of incidents per day

Number of incidents per month

Most common incident types

Highest-risk campus locations

Average response time

Resolved vs unresolved incidents

Emergency incidents

Officer workload

Officer performance

Use:

Bar charts

Pie charts

Line charts

Summary cards

The analytics dashboard should be modern, clean, and easy to understand.

PART 31: DATABASE STRUCTURE

Design the backend database around the following main entities:

Users

User ID

Full Name

Gender

Email

Phone Number

Student/Staff Number

Account Type

Profile Photo

Password Hash

Account Status

Created Date

Security Officers

Officer ID

User ID

Staff Number

Availability Status

Approval Status

Shift Information

Incidents

Incident ID

Reporter ID

Assigned Officer ID

Incident Category

Description

Priority

Status

Latitude

Longitude

Location Name

Reported Time

Officer Assigned Time

Arrival Time

Resolved Time

Closed Time

Incident Evidence

Evidence ID

Incident ID

File Type

File URL

Uploaded Date

Incident Resolution

Resolution ID

Incident ID

Officer ID

Outcome

Action Taken

Resolution Description

Notes

Date Attended

Notifications

Notification ID

User ID

Title

Message

Read Status

Created Date

App Security

User ID

App Lock PIN Hash

Biometric Enabled

Last Login

PART 32: IMPORTANT SECURITY REQUIREMENTS

The application must:

Encrypt passwords using secure hashing

Never store plain text passwords

Use secure authentication tokens

Use role-based access control

Restrict Security Officer features to authorized officers

Restrict Administrator features to administrators

Protect user personal information

Use secure database communication

Request location permissions clearly

Allow users to control location permissions

Use device biometric APIs instead of storing fingerprints

Secure uploaded profile photos and incident evidence

Maintain incident audit logs

Record important actions performed by security officers and administrators

PART 33: COMPLETE USER FLOW

RESIDENT FLOW

Open App

↓

Login

↓

App Lock PIN / Biometric Authentication

↓

Resident Dashboard

↓

Emergency SOS

OR

Report Incident

↓

Select Category

↓

Add Description

↓

Capture Live Location / Pin Location

↓

Add Optional Evidence

↓

Submit Report

↓

Incident Received

↓

Security Officer Assigned

↓

Officer Responding

↓

Officer Arrives

↓

Incident Resolved

↓

Resident Receives Resolution

↓

Incident Closed

SECURITY OFFICER FLOW

Open App

↓

Login

↓

App Lock

↓

Security Dashboard

↓

Receive Incoming Incident

↓

Review Priority

↓

View Reporter Information

↓

View Location

↓

Accept Incident

↓

Status: Responding

↓

Navigate to Location

↓

Mark Arrived

↓

Respond to Incident

↓

Complete Resolution Report

↓

Mark Resolved

↓

Incident Closed

ADMINISTRATOR FLOW

Login

↓

Admin Dashboard

↓

Monitor Active Incidents

↓

Monitor Officers

↓

Approve Security Officer Registrations

↓

Manage Users

↓

Reassign Incidents

↓

View Response Times

↓

View Analytics

↓

Generate Reports

FINAL DESIGN REQUIREMENT

Create a complete, realistic, production-quality Campus Security Incident Reporting and Response Management System.

The application should feel similar in quality to a modern emergency response, campus safety, or professional security management application.

The UI should clearly communicate:

Safety

Urgency

Reliability

Professionalism

Fast emergency response

Easy incident reporting

Real-time tracking

Secure authentication

Create all major screens, connected user flows, navigation, forms, dashboards, maps, incident timelines, notifications, emergency actions, security officer workflows, and administrator management features.

The final result should be a complete visual prototype showing the entire application ecosystem, including the Resident Application, Security Officer Application, and Administrator Dashboard.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8bc847da-ea80-40de-ae62-2a96f97d5f8c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
