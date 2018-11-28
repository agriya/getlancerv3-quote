# Getlancer Quote

Getlancer Quote, part of Getlancer Suite (Bidding, Quote, Jobs, Portfolio) is an open source service marketplace script that is capable to run sites similar to Thumbtack, Zaarly, etc. It is written in AngularJS with REST API for high performance in mind.

> This project is part of Agriya Open Source efforts. Getlancer was originally a paid script and was selling around 60000 Euros. It is now released under dual license ([OSL 3.0](https://www.agriya.com/resources) & [Commercial](https://www.agriya.com/products/thumbtack-clone)) for open source community benefits.

[![Thumbtack Clone Script](https://user-images.githubusercontent.com/43058084/45251565-e7fd3500-b365-11e8-8e83-34f2983d6f67.png)](https://www.agriya.com/products/thumbtack-clone)


## Support

Getlancer Quote is an open source project. Full commercial support (commercial license, customization, training, etc) are available through [Getlancer  platform support](https://www.agriya.com/products/thumbtack-clone)

Theming partner [CSSilize for design and HTML conversions](http://cssilize.com/)

## Getlancer Suite

Agriya Getlancer Suite is a complete freelancer marketplace platform that caters to bidding, quote, jobs and portfolio business models. Any website can be built in combination of these modules, say with bidding and quote, or with all, etc.

* [Getlancer Bidding](https://github.com/agriya/getlancerv3-bidding) - bidding marketplaces like or clone of Freelancer, Guru, elance, Scriptlance, oDesk, Redbeacon, PeoplePerHour, McroWorkers, etc.
* [Getlancer Quote](https://github.com/agriya/getlancerv3-quote) - quote marketplaces like or clone of Thumbtack, Zaarly, Localmind, Redbeacon, TaskRabbit, Urgntly, HouseJoy.
* [Getlancer Jobs](https://github.com/agriya/getlancerv3-job) - jobs marketplaces like or clone of Startuply, Coroflot, AuthenticJobs, Guru, WorkInStartups, dribbble, behance.
* [Getlancer Portfolio](https://github.com/agriya/getlancerv3-portfolio) - portfolio based marketplaces like or clone of dribbble, behance, Coroflot.



## How it works

[Thumbtack clone](https://www.agriya.com/products/thumbtack-clone) script defines two communities, service provider and the others who wants the service to get it done. Users can post their request by means of job and that will be notified to all the service professionals who are expertise in the particular area of interest. So the service pro can send quote to the defined task therefore you can get multiple quotes from several service pro as well. 

Once you finalize with the particular service pro, then you can communicate with them and get your job done. Once the job completes, Service pro and the others can review each other.

[![Thumbtack Clone](https://user-images.githubusercontent.com/43058084/45252743-aecec000-b379-11e8-8e42-aa13636f3c4b.png)](https://www.agriya.com/products/thumbtack-clone)

## Features

### Geo Location Based Listing

Ease of finding your local service provider with our Geo-based listing functionality with crystal clear accuracy.
  
### Intuitive Category Management

Whatever be your business model is, we made our script with dynamic form builder whereby you can create any service to the extent without having any difficulties.

### Dual Sign up

Every coin has two sides. Similarly, one can be either Service pro or an user based on their instance. Through a single access details, they can act as both the roles.

### Interoperability

Tired of updating the website whenever the new trend unveils? Agriya's Getlancer Suite is power-packed with Front and Back approach. So you can have an absolute freedom to customize the website easily with your intended data metrics.

### AI Enabled Script

Most of the functionalities are automated as it feels the current stats and takes you to the intended space where you can obtain your needed data as well. We indulged with bot mechanism with the script to make it more friendly with the search engines.

## Getting Started

### Prerequisites

#### For deployment

* PostgreSQL >= 9.4
* PHP >= 5.5.9 with OpenSSL, PDO, Mbstring, JSON and cURL extensions
* Nginx (preferred) or Apache

#### For building (build tools)

* Nodejs
* Composer
* Bower
* Grunt

### Setup

* PHP dependencies are handled through `composer` (Refer `/server/php/Slim/`)
* JavaScript dependencies are handled through `bower` (Refer `/client/`)
* Needs writable permission for `/tmp/` and `/media/` folders found within project path
* Build tasks are handled through `grunt`
* Database schema `/sql/getlancer_with_empty_data.sql`
* Cron with below:
```bash
# Common
*/2 * * * * /{$absolute_project_path}/server/php/Slim/shell/main.sh 1 >> /{$absolute_project_path}/tmp/logs/shell.log 2 >> /{$absolute_project_path}/tmp/logs/shell.log
```

### Contributing

Our approach is similar to Magento. If anything is not clear, please [contact us](https://www.agriya.com/contact).

All Submissions you make to Getlancer through GitHub are subject to the following terms and conditions:

* You grant Agriya a perpetual, worldwide, non-exclusive, no charge, royalty free, irrevocable license under your applicable copyrights and patents to reproduce, prepare derivative works of, display, publicly perform, sublicense and distribute any feedback, ideas, code, or other information ("Submission") you submit through GitHub.
* Your Submission is an original work of authorship and you are the owner or are legally entitled to grant the license stated above.


### License

Copyright (c) 2014-2018 [Agriya](https://www.agriya.com/).

Dual License ([OSL 3.0](https://www.agriya.com/resources) & [Commercial License](https://www.agriya.com/contact))
