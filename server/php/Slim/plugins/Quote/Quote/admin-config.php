<?php
/**
 * Plugin
 *
 * PHP version 5
 *
 * @category   PHP
 * @package    GetlancerV3
 * @subpackage Core
 * @author     Agriya <info@agriya.com>
 * @copyright  2018 Agriya Infoway Private Ltd
 * @license    http://www.agriya.com/ Agriya Infoway Licence
 * @link       http://www.agriya.com
 */
$menus = array(
    'Services' => array(
        'title' => 'Services',
        'icon_template' => '<span class="fa fa-cogs"></span>',
        'child_sub_menu' => array(
            'quote_services' => array(
                'title' => 'Services',
                'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                'link' => '/quote_services/list?search={"filter":"all"}',
                'suborder' => 1
            ) ,
            'quote_service_photos' => array(
                'title' => 'Photos',
                'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                'suborder' => 2
            ) ,
            'quote_service_videos' => array(
                'title' => 'Videos',
                'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                'suborder' => 3
            ) ,
            'quote_faq_answers' => array(
                'title' => 'FAQs',
                'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                'suborder' => 4
            ) ,
            'service_views' => array(
                'title' => 'Service Views',
                'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                'suborder' => 8
            )
        ) ,
        'order' => 2
    ) ,
    'Quote Requests' => array(
        'title' => 'Quote Requests',
        'icon_template' => '<span class="fa fa-file-text-o"></span>',
        'child_sub_menu' => array(
            'quote_requests' => array(
                'title' => 'Sales',
                'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                'link' => '/quote_requests/list?search={"is_request_for_buy":"true"}',
            ) ,
            'quote_requests' => array(
                'title' => 'Requests',
                'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                'link' => '/quote_requests/list?search={"is_request_for_buy":"false"}',
                'suborder' => 1
            ) ,
            'quote_bids' => array(
                'title' => 'Quotes',
                'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                'suborder' => 2
            ) ,
        ) ,
        'order' => 3
    ) ,
    'Master' => array(
        'title' => 'Master',
        'icon_template' => '<span class="glyphicon glyphicon-dashboard"></span>',
        'child_sub_menu' => array(
            'quote_categories' => array(
                'title' => 'Service Categories',
                'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                'suborder' => 9
            ) ,
            'quote_faq_question_templates' => array(
                'title' => 'Service FAQ Templates',
                'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                'suborder' => 10
            ) ,
            'quote_user_faq_questions' => array(
                'title' => 'Service User Question',
                'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                'suborder' => 11
            ) ,
        ) ,
    ) ,
    'Settings' => array(
        'title' => 'Settings',
        'icon_template' => '<span class="glyphicon glyphicon-cog"></span>',
        'child_sub_menu' => array(
            'servicelocations' => array(
                'title' => 'Service Locations',
                'icon_template' => '<span class="fa fa-cog"></span>',
                'link' => '/servicelocation/622',
                'suborder' => 2
            ) ,
        ) ,
        'order' => 10
    ) ,
);
$tables = array(
    'quote_services' => array(
        'listview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'user.username',
                    'label' => 'Provider',
                ) ,
                2 => array(
                    'name' => 'id',
                    'label' => 'Image',
                    'template' => '<display-image entry="entry" thumb="normal_thumb" type="QuoteService"  entity="entity"></display-image>',
                ) ,
                3 => array(
                    'name' => 'business_name',
                    'label' => 'Title',
                ) ,
                4 => array(
                    'name' => 'quote_bid_count',
                    'label' => 'Total Requests',
                    'template' => '<a href="#/quote_bids/list?search=%7B%22quote_request_id%22:{{entry.values.id}}%7D">{{entry.values.quote_bid_count}}</a>',
                ) ,
                5 => array(
                    'name' => 'quote_bid_discussion_count',
                    'label' => 'Under Discussion',
                    'template' => '<a href="#/quote_bids/list?search=%7B%22quote_service_id%22:{{entry.values.id}},%22quote_status_id%22:2%7D">{{entry.values.quote_bid_discussion_count}}</a>',
                ) ,
                6 => array(
                    'name' => 'quote_bid_hired_count',
                    'label' => 'Hired',
                    'template' => '<a href="#/quote_bids/list?search=%7B%22quote_service_id%22:{{entry.values.id}},%22quote_status_id%22:3%7D">{{entry.values.quote_bid_hired_count}}</a>',
                ) ,
                7 => array(
                    'name' => 'quote_bid_completed_count',
                    'label' => 'Completed',
                    'template' => '<a href="#/quote_bids/list?search=%7B%22quote_service_id%22:{{entry.values.id}},%22quote_status_id%22:6%7D">{{entry.values.quote_bid_completed_count}}</a>',
                ) ,
                8 => array(
                    'name' => 'quote_bid_not_completed_count',
                    'label' => 'Incompletes',
                    'template' => '<a href="#/quote_bids/list?search=%7B%22quote_service_id%22:{{entry.values.id}},%22quote_status_id%22:7%7D">{{entry.values.quote_bid_completed_count}}</a>',
                ) ,
                9 => array(
                    'name' => 'quote_service_photo_count',
                    'label' => 'Photos',
                    'template' => '<a href="#/quote_service_photos/list?search=%7B%22quote_service_id%22:{{entry.values.id}}%7D">{{entry.values.quote_service_photo_count}}</a>',
                ) ,
                10 => array(
                    'name' => 'quote_service_video_count',
                    'label' => 'Videos',
                    'template' => '<a href="#/quote_service_videos/list?search=%7B%22quote_service_id%22:{{entry.values.id}}%7D">{{entry.values.quote_service_video_count}}</a>',
                ) ,
                11 => array(
                    'name' => 'quote_faq_answer_count',
                    'label' => 'FAQs',
                    'template' => '<a href="#/quote_faq_answers/list?search=%7B%22quote_service_id%22:{{entry.values.id}}%7D">{{entry.values.quote_faq_answer_count}}</a>'
                ) ,
                12 => array(
                    'name' => 'review_count',
                    'label' => 'Reviews',
                    'template' => '<a href="#/service_reviews/list?search=%7B%22class%22:%22QuoteService%22,%22foreign_id%22:{{entry.values.id}}%7D">{{entry.values.review_count}}</a>'
                ) ,
                13 => array(
                    'name' => 'view_count',
                    'label' => 'Views',
                    'template' => '<a href="#/service_views/list?search=%7B%22class%22:%22QuoteService%22,%22foreign_id%22:{{entry.values.id}}%7D">{{entry.values.view_count}}</a>'
                ) ,
                15 => array(
                    'name' => 'is_active',
                    'label' => 'Active?',
                    'type' => 'boolean'
                ) ,
                16 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
            'title' => 'Services',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'edit',
                1 => 'show',
                2 => 'delete',
            ) ,
            'batchActions' => array(
                0 => 'delete',
                1 => '<batch-adminsuspend type="suspend" action="quote_services" selection="selection"></batch-adminsuspend>',
                2 => '<batch-adminunsuspend type="unsuspend" action="quote_services" selection="selection"></batch-adminunsuspend>',
                3 => '<batch-adminactive type="active" action="quote_services" selection="selection"></batch-adminactive>',
                4 => '<batch-admininactive type="inactive" action="quote_services" selection="selection"></batch-admininactive>'
            ) ,
            'filters' => array(
                0 => array(
                    'name' => 'q',
                    'pinned' => true,
                    'label' => 'Search',
                    'type' => 'template',
                    'template' => '',
                ) ,
                1 => array(
                    'name' => 'user_id',
                    'label' => 'Service Provider',
                    'targetEntity' => 'users',
                    'targetField' => 'username',
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                    'type' => 'reference',
                    'remoteComplete' => true,
                    'remoteCompleteAdditionalParams' => array(
                        'role' => 'freelancer'
                    ) ,
                    'permanentFilters' => array(
                        'role' => 'freelancer'
                    )
                ) ,
                2 => array(
                    'name' => 'filter',
                    'label' => 'Active?',
                    'type' => 'choice',
                    'choices' => array(
                        0 => array(
                            'label' => 'Active',
                            'value' => 'active',
                        ) ,
                        1 => array(
                            'label' => 'Inactive',
                            'value' => 'inactive',
                        ) ,
                    ) ,
                ) ,
                3 => array(
                    'name' => 'is_admin_suspend',
                    'type' => 'choice',
                    'label' => 'Admin Suspend?',
                    'choices' => array(
                        0 => array(
                            'label' => 'Yes',
                            'value' => true,
                        ) ,
                        1 => array(
                            'label' => 'No',
                            'value' => false,
                        ) ,
                    ) ,
                ) ,
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch',
                1 => 'filter',
                2 => '<project-create entity="service"></project-create>',
            ) ,
        ) ,
        'creationview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'business_name',
                    'label' => 'Business Name',
                    'type' => 'string',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                1 => array(
                    'name' => 'how_does_your_service_stand_out',
                    'label' => 'How Does Your Service Stand Out',
                    'type' => 'text',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                2 => array(
                    'name' => 'what_do_you_enjoy_about_the_work_you_do',
                    'label' => 'What Do You Enjoy About The Work You Do',
                    'type' => 'text',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                3 => array(
                    'name' => 'website_url',
                    'label' => 'Website Url',
                    'type' => 'string',
                    'validation' => array(
                        'required' => false,
                    ) ,
                ) ,
                4 => array(
                    'name' => 'phone_number',
                    'label' => 'Phone Number',
                    'type' => 'string',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                5 => array(
                    'name' => 'number_of_employees',
                    'label' => 'Number Of Employees',
                    'type' => 'number',
                    'validation' => array(
                        'required' => false,
                    ) ,
                ) ,
                6 => array(
                    'name' => 'year_founded',
                    'label' => 'Year Founded',
                ) ,
                7 => array(
                    'name' => 'full_address',
                    'label' => 'Full Address',
                    'type' => 'string',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                8 => array(
                    'name' => 'address',
                    'label' => 'Address',
                    'type' => 'string',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                9 => array(
                    'name' => 'city.name',
                    'label' => 'City',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                10 => array(
                    'name' => 'state.name',
                    'label' => 'State',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                11 => array(
                    'name' => 'country.iso_alpha2',
                    'label' => 'Country',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                12 => array(
                    'name' => 'zip_code',
                    'label' => 'Zip Code',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                13 => array(
                    'name' => 'latitude',
                    'label' => 'Latitude',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                14 => array(
                    'name' => 'longitude',
                    'label' => 'Longitude',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                15 => array(
                    'name' => 'is_service_provider_travel_to_customer_place',
                    'label' => 'Service Provider Travel To Customer Place?',
                    'type' => 'choice',
                    'defaultValue' => false,
                    'validation' => array(
                        'required' => true,
                    ) ,
                    'choices' => array(
                        0 => array(
                            'label' => 'Yes',
                            'value' => true,
                        ) ,
                        1 => array(
                            'label' => 'No',
                            'value' => false,
                        ) ,
                    ) ,
                ) ,
                16 => array(
                    'name' => 'service_provider_travels_upto',
                    'label' => 'Service Provider Travels Upto',
                    'type' => 'number',
                    'validation' => array(
                        'required' => false,
                    ) ,
                ) ,
                17 => array(
                    'name' => 'is_customer_travel_to_me',
                    'label' => 'Customer Travel To Me?',
                    'type' => 'choice',
                    'defaultValue' => false,
                    'validation' => array(
                        'required' => true,
                    ) ,
                    'choices' => array(
                        0 => array(
                            'label' => 'Yes',
                            'value' => true,
                        ) ,
                        1 => array(
                            'label' => 'No',
                            'value' => false,
                        ) ,
                    ) ,
                ) ,
                18 => array(
                    'name' => 'is_over_phone_or_internet',
                    'label' => 'Over Phone Or Internet?',
                    'type' => 'choice',
                    'defaultValue' => false,
                    'validation' => array(
                        'required' => true,
                    ) ,
                    'choices' => array(
                        0 => array(
                            'label' => 'Yes',
                            'value' => true,
                        ) ,
                        1 => array(
                            'label' => 'No',
                            'value' => false,
                        ) ,
                    ) ,
                ) ,
                19 => array(
                    'name' => 'is_active',
                    'label' => 'Active?',
                    'type' => 'choice',
                    'defaultValue' => false,
                    'validation' => array(
                        'required' => true,
                    ) ,
                    'choices' => array(
                        0 => array(
                            'label' => 'Yes',
                            'value' => true,
                        ) ,
                        1 => array(
                            'label' => 'No',
                            'value' => false,
                        ) ,
                    ) ,
                ) ,
            ) ,
        ) ,
        'showview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'user.username',
                    'label' => 'Provider',
                ) ,
                2 => array(
                    'name' => '',
                    'label' => 'Image',
                    'template' => '<display-image entry="entry" thumb="normal_thumb" type="QuoteService"  entity="entity"></display-image>',
                ) ,
                3 => array(
                    'name' => 'business_name',
                    'label' => 'Title',
                ) ,
                4 => array(
                    'name' => 'full_address',
                    'label' => 'Sevice Location',
                ) ,
                5 => array(
                    'name' => 'how_does_your_service_stand_out',
                    'label' => 'How Does Your Service Stand Out',
                ) ,
                6 => array(
                    'name' => 'what_do_you_enjoy_about_the_work_you_do',
                    'label' => 'What Do You Enjoy About The Work You Do',
                ) ,
                7 => array(
                    'name' => 'quote_bid_count',
                    'label' => 'Total Requests',
                    'template' => '<a href="#/quote_bids/list?search=%7B%22quote_request_id%22:{{entry.values.id}}%7D">{{entry.values.quote_bid_count}}</a>',
                ) ,
                8 => array(
                    'name' => 'quote_bid_discussion_count',
                    'label' => 'Under Discussion',
                    'template' => '<a href="#/quote_bids/list?search=%7B%22quote_service_id%22:{{entry.values.id}},%22quote_status_id%22:2%7D">{{entry.values.quote_bid_discussion_count}}</a>',
                ) ,
                9 => array(
                    'name' => 'quote_bid_hired_count',
                    'label' => 'Hired',
                    'template' => '<a href="#/quote_bids/list?search=%7B%22quote_service_id%22:{{entry.values.id}},%22quote_status_id%22:3%7D">{{entry.values.quote_bid_hired_count}}</a>',
                ) ,
                10 => array(
                    'name' => 'quote_bid_completed_count',
                    'label' => 'Completed',
                    'template' => '<a href="#/quote_bids/list?search=%7B%22quote_service_id%22:{{entry.values.id}},%22quote_status_id%22:6%7D">{{entry.values.quote_bid_completed_count}}</a>',
                ) ,
                11 => array(
                    'name' => 'quote_bid_not_completed_count',
                    'label' => 'Incompleted',
                    'template' => '<a href="#/quote_bids/list?search=%7B%22quote_service_id%22:{{entry.values.id}},%22quote_status_id%22:7%7D">{{entry.values.quote_bid_completed_count}}</a>',
                ) ,
                12 => array(
                    'name' => 'quote_service_photo_count',
                    'label' => 'Photos',
                    'template' => '<a href="#/quote_service_photos/list?search=%7B%22quote_service_id%22:{{entry.values.id}}%7D">{{entry.values.quote_service_photo_count}}</a>',
                ) ,
                13 => array(
                    'name' => 'quote_service_audio_count',
                    'label' => 'Audios',
                    'template' => '<a href="#/quote_service_audios/list?search=%7B%22quote_service_id%22:{{entry.values.id}}%7D">{{entry.values.quote_service_audio_count}}</a>',
                ) ,
                14 => array(
                    'name' => 'quote_service_video_count',
                    'label' => 'Videos',
                    'template' => '<a href="#/quote_service_videos/list?search=%7B%22quote_service_id%22:{{entry.values.id}}%7D">{{entry.values.quote_service_video_count}}</a>',
                ) ,
                15 => array(
                    'name' => 'quote_faq_answer_count',
                    'label' => 'FAQs',
                    'template' => '<a href="#/quote_faq_answers/list?search=%7B%22quote_service_id%22:{{entry.values.id}}%7D">{{entry.values.quote_faq_answer_count}}</a>'
                ) ,
                16 => array(
                    'name' => 'review_count',
                    'label' => 'Reviews',
                    'template' => '<a href="#/service_reviews/list?search=%7B%22class%22:%22QuoteService%22,%22foreign_id%22:{{entry.values.id}}%7D">{{entry.values.review_count}}</a>'
                ) ,
                17 => array(
                    'name' => 'view_count',
                    'label' => 'Views',
                    'template' => '<a href="#/service_views/list?search=%7B%22class%22:%22QuoteService%22,%22foreign_id%22:{{entry.values.id}}%7D">{{entry.values.view_count}}</a>'
                ) ,
                19 => array(
                    'name' => 'is_active',
                    'label' => 'Active?',
                    'type' => 'boolean'
                ) ,
                20 => array(
                    'name' => 'is_admin_suspend',
                    'label' => 'Admin Suspend?',
                    'type' => 'boolean'
                ) ,
                21 => array(
                    'name' => 'quote_service_photos',
                    'label' => 'Quote Service Photos',
                    'targetEntity' => 'quote_service_photos',
                    'targetReferenceField' => 'quote_service_id',
                    'targetFields' => array(
                        0 => array(
                            'name' => '',
                            'label' => 'Image',
                            'template' => '<display-images entry="entry" thumb="normal_thumb" type="QuoteServicePhoto"  entity="entity"></display-images>',
                        ) ,
                    ) ,
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                    'type' => 'referenced_list',
                ) ,
                22 => array(
                    'name' => 'quote_service_videos',
                    'label' => 'Quote Service Videos',
                    'targetEntity' => 'quote_service_videos',
                    'targetReferenceField' => 'quote_service_id',
                    'targetFields' => array(
                        0 => array(
                            'name' => 'video_url',
                            'label' => 'Video URL',
                        ) ,
                    ) ,
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                    'type' => 'referenced_list',
                ) ,
                21 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
        ) ,
    ) ,
    'quote_service_photos' => array(
        'listview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'quote_service.user.username',
                    'label' => 'User',
                ) ,
                2 => array(
                    'name' => 'quote_service.business_name',
                    'label' => 'Service',
                ) ,
                3 => array(
                    'name' => 'id',
                    'label' => 'Image',
                    'template' => '<display-images entry="entry" thumb="normal_thumb" type="QuoteServicePhoto"  entity="entity"></display-images>',
                ) ,
                4 => array(
                    'name' => 'caption',
                    'label' => 'Caption',
                ) ,
                5 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                )
            ) ,
            'title' => 'Photos',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'edit',
                1 => 'show',
                2 => 'delete',
            ) ,
            'batchActions' => array(
                0 => 'delete',
            ) ,
            'filters' => array(
                0 => array(
                    'name' => 'q',
                    'pinned' => true,
                    'label' => 'Search',
                    'type' => 'template',
                    'template' => '',
                ) ,
                1 => array(
                    'name' => 'quote_service_id',
                    'label' => 'Service',
                    'targetEntity' => 'quote_services',
                    'targetField' => 'business_name',
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                    'type' => 'reference',
                    'remoteComplete' => true,
                ) ,
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch',
                1 => 'filter',
            ) ,
        ) ,
        'creationview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'quote_service_id',
                    'label' => 'Quote Service',
                    'targetEntity' => 'quote_services',
                    'targetField' => 'business_name',
                    'type' => 'reference',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                1 => array(
                    'name' => 'caption',
                    'label' => 'Caption',
                    'type' => 'string',
                    'defaultValue' => 'NULL',
                    'validation' => array(
                        'required' => false,
                    ) ,
                ) ,
            ) ,
        ) ,
        'editionview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'quote_service_id',
                    'label' => 'Service',
                    'targetEntity' => 'quote_services',
                    'targetField' => 'business_name',
                    'type' => 'reference',
                    'editable' => false,
                ) ,
                1 => array(
                    'name' => 'caption',
                    'label' => 'Caption',
                    'validation' => array(
                        'required' => false,
                    ) ,
                ) ,
            ) ,
        ) ,
    ) ,
    'quote_service_videos' => array(
        'listview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'quote_service.user.username',
                    'label' => 'User',
                ) ,
                2 => array(
                    'name' => 'quote_service.business_name',
                    'label' => 'Service',
                ) ,
                3 => array(
                    'name' => 'video_url',
                    'label' => 'Video URL',
                ) ,
                4 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
            'title' => 'Videos',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'edit',
                1 => 'show',
                2 => 'delete',
            ) ,
            'batchActions' => array(
                0 => 'delete',
            ) ,
            'filters' => array(
                0 => array(
                    'name' => 'q',
                    'pinned' => true,
                    'label' => 'Search',
                    'type' => 'template',
                    'template' => '',
                ) ,
                1 => array(
                    'name' => 'quote_service_id',
                    'label' => 'Service',
                    'targetEntity' => 'quote_services',
                    'targetField' => 'business_name',
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                    'type' => 'reference',
                    'remoteComplete' => true,
                ) ,
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch',
                1 => 'filter',
            ) ,
        ) ,
        'creationview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'quote_service_id',
                    'label' => 'Quote Service',
                    'targetEntity' => 'quote_services',
                    'targetField' => 'business_name',
                    'type' => 'reference',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                1 => array(
                    'name' => 'video_url',
                    'label' => 'Video URL',
                    'type' => 'text',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                2 => array(
                    'name' => 'video_url',
                    'label' => 'Video Url',
                    'type' => 'text',
                    'validation' => array(
                        'required' => false,
                    ) ,
                ) ,
            ) ,
        ) ,
        'editionview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'quote_service_id',
                    'label' => 'Service',
                    'targetEntity' => 'quote_services',
                    'targetField' => 'business_name',
                    'type' => 'reference',
                    'editable' => false,
                ) ,
                1 => array(
                    'name' => 'video_url',
                    'label' => 'Video URL',
                    'type' => 'text',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
            ) ,
        ) ,
    ) ,
    'quote_faq_answers' => array(
        'listview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'quote_service.user.username',
                    'label' => 'User',
                ) ,
                2 => array(
                    'name' => 'quote_service.business_name',
                    'label' => 'Service',
                ) ,
                3 => array(
                    'name' => 'question',
                    'label' => 'Question',
                    'template' => '<faq-question entry="entry"  entity="entity"></faq-question>'
                ) ,
                4 => array(
                    'name' => 'answer',
                    'label' => 'Answer',
                ) ,
                5 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
            'title' => 'Service Faq Answers',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'edit',
                1 => 'show',
                2 => 'delete',
            ) ,
            'batchActions' => array(
                0 => 'delete',
            ) ,
            'filters' => array(
                0 => array(
                    'name' => 'q',
                    'pinned' => true,
                    'label' => 'Search',
                    'type' => 'template',
                    'template' => '',
                ) ,
                1 => array(
                    'name' => 'quote_service_id',
                    'label' => 'Service',
                    'targetEntity' => 'quote_services',
                    'targetField' => 'business_name',
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                    'type' => 'reference',
                    'remoteComplete' => true,
                ) ,
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch',
                1 => 'filter',
            ) ,
        ) ,
        'creationview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'quote_service_id',
                    'label' => 'Quote Service',
                    'targetEntity' => 'quote_services',
                    'targetField' => 'business_name',
                    'type' => 'reference',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                1 => array(
                    'name' => 'quote_faq_question_template_id',
                    'label' => 'Quote Faq Question Template',
                    'targetEntity' => 'quote_faq_question_templates',
                    'targetField' => 'name',
                    'type' => 'reference',
                    'validation' => array(
                        'required' => false,
                    ) ,
                ) ,
                2 => array(
                    'name' => 'quote_user_faq_question_id',
                    'label' => 'Quote User Faq Question',
                    'targetEntity' => 'quote_user_faq_questions',
                    'targetField' => 'name',
                    'type' => 'reference',
                    'validation' => array(
                        'required' => false,
                    ) ,
                ) ,
                3 => array(
                    'name' => 'answer',
                    'label' => 'Answer',
                    'type' => 'text',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
            ) ,
        ) ,
        'editionview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'quote_service_id',
                    'label' => 'Service',
                    'targetEntity' => 'quote_services',
                    'targetField' => 'business_name',
                    'type' => 'reference',
                    'editable' => false,
                ) ,
                1 => array(
                    'name' => 'quote_faq_question_template_id',
                    'label' => 'Question',
                    'template' => '<faq-question entry="entry"  entity="entity"></faq-question>',
                    'editable' => false,
                ) ,
                2 => array(
                    'name' => 'answer',
                    'label' => 'Answer',
                    'type' => 'text',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
            ) ,
        ) ,
    ) ,
    'quote_requests' => array(
        'listview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'user.username',
                    'label' => 'User',
                ) ,
                2 => array(
                    'name' => 'quote_category.name',
                    'label' => 'Category',
                ) ,
                3 => array(
                    'name' => 'title',
                    'label' => 'Title',
                ) ,
                4 => array(
                    'name' => 'full_address',
                    'label' => 'Work Location',
                ) ,
                5 => array(
                    'name' => 'quote_bid_count',
                    'label' => 'Total Requests',
                    'template' => '<a href="#/quote_bids/list?search=%7B%22quote_request_id%22:{{entry.values.id}}%7D">{{entry.values.quote_bid_count}}</a>',
                ) ,
                6 => array(
                    'name' => 'quote_bid_discussion_count',
                    'label' => 'Under Discussion',
                    'template' => '<a href="#/quote_bids/list?search=%7B%22quote_request_id%22:{{entry.values.id}},%22quote_status_id%22:2%7D">{{entry.values.quote_bid_discussion_count}}</a>',
                ) ,
                7 => array(
                    'name' => 'quote_bid_hired_count',
                    'label' => 'Hired',
                    'template' => '<a href="#/quote_bids/list?search=%7B%22quote_request_id%22:{{entry.values.id}},%22quote_status_id%22:3%7D">{{entry.values.quote_bid_hired_count}}</a>',
                ) ,
                8 => array(
                    'name' => 'quote_bid_completed_count',
                    'label' => 'Completed',
                    'template' => '<a href="#/quote_bids/list?search=%7B%22quote_request_id%22:{{entry.values.id}},%22quote_status_id%22:4%7D">{{entry.values.quote_bid_completed_count}}</a>',
                ) ,
                9 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
            'title' => 'Requests',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'show',
                1 => 'delete',
            ) ,
            'batchActions' => array(
                0 => 'delete',
            ) ,
            'filters' => array(
                0 => array(
                    'name' => 'q',
                    'pinned' => true,
                    'label' => 'Search',
                    'type' => 'template',
                    'template' => '',
                ) ,
                1 => array(
                    'name' => 'user_id',
                    'label' => 'User',
                    'targetEntity' => 'users',
                    'targetField' => 'username',
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                    'type' => 'reference',
                    'remoteComplete' => true,
                ) ,
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch',
                1 => 'filter'
            ) ,
        ) ,
        'showview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'user.username',
                    'label' => 'User',
                ) ,
                2 => array(
                    'name' => 'quote_category.name',
                    'label' => 'Category',
                ) ,
                3 => array(
                    'name' => 'title',
                    'label' => 'Title',
                ) ,
                4 => array(
                    'name' => 'full_address',
                    'label' => 'Work Location',
                ) ,
                5 => array(
                    'name' => 'quote_bid_count',
                    'label' => 'Total Requests',
                    'template' => '<a href="#/quote_bids/list?search=%7B%22quote_request_id%22:{{entry.values.id}}%7D">{{entry.values.quote_bid_count}}</a>',
                ) ,
                6 => array(
                    'name' => 'quote_bid_discussion_count',
                    'label' => 'Under Discussion',
                    'template' => '<a href="#/quote_bids/list?search=%7B%22quote_request_id%22:{{entry.values.id}},%22quote_status_id%22:{{entry.values.id}}%7D">{{entry.values.quote_bid_discussion_count}}</a>',
                ) ,
                7 => array(
                    'name' => 'quote_bid_hired_count',
                    'label' => 'Hired',
                    'template' => '<a href="#/quote_bids/list?search=%7B%22quote_request_id%22:{{entry.values.id}},%22quote_status_id%22:{{entry.values.id}}%7D">{{entry.values.quote_bid_hired_count}}</a>',
                ) ,
                8 => array(
                    'name' => 'quote_bid_completed_count',
                    'label' => 'Completed',
                    'template' => '<a href="#/quote_bids/list?search=%7B%22quote_request_id%22:{{entry.values.id}},%22quote_status_id%22:{{entry.values.id}}%7D">{{entry.values.quote_bid_completed_count}}</a>',
                ) ,
                9 => array(
                    'name' => '',
                    'label' => 'Form fields',
                    'template' => '<form-fields entry="{id:entry.values.form_field_submission}" type="Quote"></form-fields>',
                ) ,
                10 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
        ) ,
    ) ,
    'quote_bids' => array(
        'listview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'id',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'user.username',
                    'label' => 'Requestor',
                ) ,
                2 => array(
                    'name' => 'quote_request.title',
                    'label' => 'Title',
                    'type' => 'wysiwyg',
                ) ,
                3 => array(
                    'name' => 'quote_service.business_name',
                    'label' => 'Service',
                    'type' => 'wysiwyg',
                ) ,
                4 => array(
                    'name' => 'service_provider_user.username',
                    'label' => 'Service provider'
                ) ,
                5 => array(
                    'name' => 'quote_amount',
                    'label' => 'Quote Amount',
                ) ,
                6 => array(
                    'name' => 'price_note',
                    'label' => 'Price Note',
                    'map' => array(
                        0 => 'truncate',
                    )
                ) ,
                7 => array(
                    'name' => 'quote_status.name',
                    'label' => 'Status',
                ) ,
                8 => array(
                    'name' => 'private_note_of_incomplete',
                    'label' => 'Incomplete Note (From Employer)',
                    'map' => array(
                        0 => 'truncate',
                    )
                ) ,
                9 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
            'title' => 'Quotes',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'show',
                1 => 'delete'
            ) ,
            'batchActions' => array(
                0 => 'delete',
            ) ,
            'filters' => array(
                0 => array(
                    'name' => 'q',
                    'pinned' => true,
                    'label' => 'Search',
                    'type' => 'template',
                    'template' => '',
                ) ,
                1 => array(
                    'name' => 'quote_request_id',
                    'label' => 'Quote Request',
                    'targetEntity' => 'quote_requests',
                    'targetField' => 'title',
                    'singleApiCall' => 'getRequest',
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                    'type' => 'reference',
                    'remoteComplete' => true,
                ) ,
                2 => array(
                    'name' => 'quote_service_id',
                    'label' => 'Quote Service',
                    'targetEntity' => 'quote_services',
                    'targetField' => 'business_name',
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                    'type' => 'reference',
                    'remoteComplete' => true,
                ) ,
                3 => array(
                    'name' => 'quote_status_id',
                    'label' => 'Quote Status',
                    'targetEntity' => 'quote_statuses',
                    'targetField' => 'name',
                    'singleApiCall' => 'getStatus',
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                    'type' => 'reference',
                    'remoteComplete' => true,
                ) ,
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch',
                1 => 'filter',
            ) ,
        ) ,
        'showview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'id',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'user.username',
                    'label' => 'Requestor',
                ) ,
                2 => array(
                    'name' => 'quote_request.title',
                    'label' => 'Title',
                ) ,
                3 => array(
                    'name' => 'quote_service.business_name',
                    'label' => 'Service',
                ) ,
                4 => array(
                    'name' => 'service_provider_user.username',
                    'label' => 'Service provider'
                ) ,
                5 => array(
                    'name' => 'quote_amount',
                    'label' => 'Quote Amount',
                ) ,
                6 => array(
                    'name' => 'quote_type',
                    'label' => 'Quote Type',
                ) ,
                7 => array(
                    'name' => 'price_note',
                    'label' => 'Price Note',
                ) ,
                8 => array(
                    'name' => 'quote_status.name',
                    'label' => 'Status',
                ) ,
                9 => array(
                    'name' => 'private_note_of_incomplete',
                    'label' => 'Incomplete Note (From Employer)',
                ) ,
                10 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
        ) ,
    ) ,
    'quote_categories' => array(
        'listview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'name',
                    'label' => 'Name',
                    'type' => 'wysiwyg',
                ) ,
                2 => array(
                    'name' => 'description',
                    'label' => 'Description',
                    'type' => 'wysiwyg',
                ) ,
                //TODO
                /*3 =>
                array (
                'name' => 'parent_category_id',
                'label' => 'Parent Category',
                'targetEntity' => 'quote_categories',
                'targetField' => 'name',
                'map' =>
                array (
                0 => 'truncate',
                ),
                'type' => 'reference',
                ),*/
                4 => array(
                    'name' => 'is_active',
                    'label' => 'Active?',
                    'type' => 'boolean',
                ) ,
                5 => array(
                    'name' => 'is_featured',
                    'label' => 'Featured?',
                    'type' => 'boolean',
                ) ,
                6 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
            'title' => 'Service Categories',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'edit',
                1 => 'show',
                2 => 'delete',
            ) ,
            'batchActions' => array(
                0 => 'delete',
            ) ,
            'filters' => array(
                0 => array(
                    'name' => 'q',
                    'pinned' => true,
                    'label' => 'Search',
                    'type' => 'template',
                    'template' => '',
                ) ,
                1 => array(
                    'name' => 'filter',
                    'type' => 'choice',
                    'label' => 'Active?',
                    'choices' => array(
                        0 => array(
                            'label' => 'Active',
                            'value' => 'active',
                        ) ,
                        1 => array(
                            'label' => 'Inactive',
                            'value' => 'inactive',
                        ) ,
                    ) ,
                ) ,
                2 => array(
                    'name' => 'is_featured',
                    'type' => 'choice',
                    'label' => 'Featured?',
                    'choices' => array(
                        0 => array(
                            'label' => 'Yes',
                            'value' => true,
                        ) ,
                        1 => array(
                            'label' => 'No',
                            'value' => false,
                        ) ,
                    ) ,
                ) ,
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch',
                1 => 'filter',
                2 => 'create',
            ) ,
        ) ,
        'creationview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'parent_category_id',
                    'label' => 'Parent Category',
                    'targetEntity' => 'quote_categories',
                    'targetField' => 'name',
                    'type' => 'reference',
                    'validation' => array(
                        'required' => false,
                    ) ,
                ) ,
                1 => array(
                    'name' => 'name',
                    'label' => 'Name',
                    'type' => 'string',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                2 => array(
                    'name' => 'image',
                    'label' => 'Image',
                    'type' => 'file',
                    'uploadInformation' => array(
                        'url' => 'api/v1/attachments?class=QuoteCategory',
                        'apifilename' => 'attachment'
                    ) ,
                ) ,
                3 => array(
                    'name' => 'is_active',
                    'label' => 'Active?',
                    'type' => 'choice',
                    'defaultValue' => true,
                    'validation' => array(
                        'required' => true,
                    ) ,
                    'choices' => array(
                        0 => array(
                            'label' => 'Yes',
                            'value' => true,
                        ) ,
                        1 => array(
                            'label' => 'No',
                            'value' => false,
                        ) ,
                    ) ,
                ) ,
                4 => array(
                    'name' => 'description',
                    'label' => 'Description',
                    'type' => 'text',
                    'validation' => array(
                        'required' => false,
                    ) ,
                ) ,
                5 => array(
                    'name' => 'is_featured',
                    'label' => 'Featured?',
                    'type' => 'choice',
                    'defaultValue' => true,
                    'validation' => array(
                        'required' => true,
                    ) ,
                    'choices' => array(
                        0 => array(
                            'label' => 'Yes',
                            'value' => true,
                        ) ,
                        1 => array(
                            'label' => 'No',
                            'value' => false,
                        ) ,
                    ) ,
                ) ,
                6 => array(
                    'name' => 'form_field_groups',
                    'label' => 'Form Fields',
                    'type' => 'embedded_list',
                    'targetFields' => array(
                        0 => array(
                            'name' => 'name',
                            'required' => true,
                            'label' => 'Group Name',
                            'type' => 'string',
                        ) ,
                        1 => array(
                            'name' => 'form_fields',
                            'label' => '',
                            'type' => 'embedded_list',
                            'targetFields' => array(
                                0 => array(
                                    'name' => 'name',
                                    'required' => true,
                                    'label' => 'Field Name',
                                    'type' => 'string',
                                ) ,
                                1 => array(
                                    'name' => 'input_type_id',
                                    'targetEntity' => 'input_types',
                                    'targetField' => 'name',
                                    'type' => 'reference',
                                    'label' => 'Input Type',
                                    'remoteComplete' => true,
                                    'required' => true,
                                ) ,
                                2 => array(
                                    'name' => 'is_required',
                                    'type' => 'choice',
                                    'label' => 'Required',
                                    'required' => true,
                                    'choices' => array(
                                        0 => array(
                                            'label' => 'Yes',
                                            'value' => true,
                                        ) ,
                                        1 => array(
                                            'label' => 'No',
                                            'value' => false,
                                        ) ,
                                    )
                                ) ,
                                3 => array(
                                    'name' => 'label',
                                    'required' => true,
                                    'label' => 'Label',
                                    'type' => 'string'
                                ) ,
                                4 => array(
                                    'name' => 'options',
                                    'type' => 'string',
                                    'label' => 'Options (Comma Seperated)'
                                ) ,
                                5 => array(
                                    'name' => 'info',
                                    'type' => 'string',
                                    'label' => 'Info'
                                ) ,
                                6 => array(
                                    'name' => 'display_order',
                                    'type' => 'number',
                                    'required' => true,
                                    'label' => 'Display Order'
                                ) ,
                                7 => array(
                                    'name' => 'is_active',
                                    'type' => 'choice',
                                    'label' => 'Active?',
                                    'required' => true,
                                    'choices' => array(
                                        0 => array(
                                            'label' => 'Yes',
                                            'value' => true,
                                        ) ,
                                        1 => array(
                                            'label' => 'No',
                                            'value' => false,
                                        ) ,
                                    )
                                )
                            )
                        )
                    )
                )
            ) ,
        ) ,
        'editionview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'parent_category_id',
                    'label' => 'Parent Category',
                    'targetEntity' => 'quote_categories',
                    'targetField' => 'name',
                    'type' => 'reference',
                    'validation' => array(
                        'required' => false,
                    ) ,
                ) ,
                1 => array(
                    'name' => 'name',
                    'label' => 'Name',
                    'type' => 'string',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                2 => array(
                    'name' => 'image',
                    'label' => 'Image',
                    'type' => 'file',
                    'uploadInformation' => array(
                        'url' => 'api/v1/attachments?class=QuoteCategory',
                        'apifilename' => 'attachment'
                    ) ,
                ) ,
                3 => array(
                    'name' => 'is_active',
                    'label' => 'Active?',
                    'type' => 'choice',
                    'defaultValue' => true,
                    'validation' => array(
                        'required' => true,
                    ) ,
                    'choices' => array(
                        0 => array(
                            'label' => 'Yes',
                            'value' => true,
                        ) ,
                        1 => array(
                            'label' => 'No',
                            'value' => false,
                        ) ,
                    ) ,
                ) ,
                4 => array(
                    'name' => 'description',
                    'label' => 'Description',
                    'type' => 'text',
                    'validation' => array(
                        'required' => false,
                    ) ,
                ) ,
                5 => array(
                    'name' => 'is_featured',
                    'label' => 'Featured?',
                    'type' => 'choice',
                    'defaultValue' => true,
                    'validation' => array(
                        'required' => true,
                    ) ,
                    'choices' => array(
                        0 => array(
                            'label' => 'Yes',
                            'value' => true,
                        ) ,
                        1 => array(
                            'label' => 'No',
                            'value' => false,
                        ) ,
                    ) ,
                ) ,
                6 => array(
                    'name' => 'form_field_groups',
                    'label' => 'Form Fields',
                    'type' => 'embedded_list',
                    'targetFields' => array(
                        0 => array(
                            'name' => 'name',
                            'required' => true,
                            'label' => 'Group Name',
                            'type' => 'string',
                        ) ,
                        1 => array(
                            'name' => 'form_fields',
                            'label' => 'Form Fields',
                            'type' => 'embedded_list',
                            'targetFields' => array(
                                0 => array(
                                    'name' => 'name',
                                    'required' => true,
                                    'label' => 'Field Name',
                                    'type' => 'string',
                                ) ,
                                1 => array(
                                    'name' => 'input_type_id',
                                    'targetEntity' => 'input_types',
                                    'targetField' => 'name',
                                    'type' => 'reference',
                                    'label' => 'Input Type',
                                    'remoteComplete' => true,
                                    'required' => true,
                                ) ,
                                2 => array(
                                    'name' => 'is_required',
                                    'type' => 'choice',
                                    'label' => 'Required',
                                    'required' => true,
                                    'choices' => array(
                                        0 => array(
                                            'label' => 'Yes',
                                            'value' => true,
                                        ) ,
                                        1 => array(
                                            'label' => 'No',
                                            'value' => false,
                                        ) ,
                                    )
                                ) ,
                                3 => array(
                                    'name' => 'label',
                                    'required' => true,
                                    'label' => 'Label',
                                    'type' => 'string'
                                ) ,
                                4 => array(
                                    'name' => 'options',
                                    'type' => 'string',
                                    'label' => 'Options (Comma Seperated)'
                                ) ,
                                5 => array(
                                    'name' => 'info',
                                    'type' => 'string',
                                    'label' => 'Info'
                                ) ,
                                6 => array(
                                    'name' => 'display_order',
                                    'required' => true,
                                    'label' => 'Display Order'
                                ) ,
                                7 => array(
                                    'name' => 'is_active',
                                    'type' => 'choice',
                                    'label' => 'Active?',
                                    'required' => true,
                                    'choices' => array(
                                        0 => array(
                                            'label' => 'Yes',
                                            'value' => true,
                                        ) ,
                                        1 => array(
                                            'label' => 'No',
                                            'value' => false,
                                        ) ,
                                    )
                                )
                            )
                        )
                    )
                )
            ) ,
        ) ,
        'showview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'name',
                    'label' => 'Name',
                ) ,
                2 => array(
                    'name' => 'description',
                    'label' => 'Description',
                ) ,
                3 => array(
                    'name' => 'parent_category_id',
                    'label' => 'Parent Category',
                    'targetEntity' => 'quote_categories',
                    'targetField' => 'name',
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                    'type' => 'reference',
                ) ,
                4 => array(
                    'name' => 'is_active',
                    'label' => 'Active?',
                    'type' => 'boolean',
                ) ,
                5 => array(
                    'name' => 'is_featured',
                    'label' => 'Featured?',
                    'type' => 'boolean',
                ) ,
                6 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
        ) ,
    ) ,
    'quote_faq_question_templates' => array(
        'listview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'question',
                    'label' => 'Question',
                ) ,
                2 => array(
                    'name' => 'is_active',
                    'label' => 'Active?',
                    'type' => 'boolean',
                ) ,
                3 => array(
                    'name' => 'created_at',
                    'label' => 'Created',
                ) ,
            ) ,
            'title' => 'Quote Faq Question Templates',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'edit',
                1 => 'delete',
            ) ,
            'batchActions' => array(
                0 => 'delete',
            ) ,
            'filters' => array(
                0 => array(
                    'name' => 'q',
                    'pinned' => true,
                    'label' => 'Search',
                    'type' => 'template',
                    'template' => '',
                ) ,
                1 => array(
                    'name' => 'filter',
                    'label' => 'Active?',
                    'type' => 'choice',
                    'label' => 'Active',
                    'choices' => array(
                        0 => array(
                            'label' => 'Active',
                            'value' => 'active',
                        ) ,
                        1 => array(
                            'label' => 'Inactive',
                            'value' => 'inactive',
                        ) ,
                    ) ,
                ) ,
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch',
                1 => 'filter',
                2 => 'create',
            ) ,
        ) ,
        'creationview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'question',
                    'label' => 'Question',
                    'type' => 'text',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                1 => array(
                    'name' => 'is_active',
                    'label' => 'Active?',
                    'type' => 'choice',
                    'defaultValue' => false,
                    'validation' => array(
                        'required' => false,
                    ) ,
                    'choices' => array(
                        0 => array(
                            'label' => 'Yes',
                            'value' => true,
                        ) ,
                        1 => array(
                            'label' => 'No',
                            'value' => false,
                        ) ,
                    ) ,
                ) ,
            ) ,
        ) ,
    ) ,
    'quote_user_faq_questions' => array(
        'listview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'user.username',
                    'label' => 'User',
                ) ,
                2 => array(
                    'name' => 'question',
                    'label' => 'Question',
                ) ,
                3 => array(
                    'name' => 'created_at',
                    'label' => 'Created',
                ) ,
            ) ,
            'title' => 'Quote User Faq Questions',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'edit',
                1 => 'delete',
                2 => 'show',
            ) ,
            'batchActions' => array(
                0 => 'delete',
            ) ,
            'filters' => array(
                0 => array(
                    'name' => 'q',
                    'pinned' => true,
                    'label' => 'Search',
                    'type' => 'template',
                    'template' => '',
                ) ,
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch',
                1 => 'filter',
            ) ,
        ) ,
        'showview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'user.username',
                    'label' => 'User',
                ) ,
                2 => array(
                    'name' => 'question',
                    'label' => 'Question',
                ) ,
                3 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
        ) ,
        'editionview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'user_id',
                    'label' => 'User',
                    'targetEntity' => 'users',
                    'targetField' => 'username',
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                    'type' => 'reference',
                    'remoteComplete' => true,
                ) ,
            ) ,
            1 => array(
                'name' => 'question',
                'label' => 'Question',
                'type' => 'text',
                'validation' => array(
                    'required' => false,
                ) ,
            ) ,
        ) ,
    ) ,
    'service_flags' => array(
        'listview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'user.username',
                    'label' => 'User',
                ) ,
                2 => array(
                    'name' => 'foreign_flag.business_name',
                    'label' => 'Service',
                ) ,
                3 => array(
                    'name' => 'flag_category.name',
                    'label' => 'Category',
                ) ,
                4 => array(
                    'name' => 'message',
                    'label' => 'Message',
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                ) ,
                5 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
            'title' => 'Service Flags',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'show',
                1 => 'delete',
            ) ,
            'batchActions' => array(
                0 => 'delete',
            ) ,
            'filters' => array(
                0 => array(
                    'name' => 'q',
                    'pinned' => true,
                    'label' => 'Search',
                    'type' => 'template',
                    'template' => '',
                ) ,
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch',
                1 => 'filter',
            ) ,
        ) ,
        'showview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'user.username',
                    'label' => 'User',
                ) ,
                2 => array(
                    'name' => 'foreign_flag.business_name',
                    'label' => 'Service',
                ) ,
                3 => array(
                    'name' => 'flag_category.name',
                    'label' => 'Category',
                ) ,
                4 => array(
                    'name' => 'message',
                    'label' => 'Message',
                ) ,
                5 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
        ) ,
    ) ,
    'service_flag_categories' => array(
        'listview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'name',
                    'label' => 'Name',
                ) ,
                2 => array(
                    'name' => 'flag_count',
                    'template' => '<a href="#/service_flags/list?search=%7B%22class%22:%22QuoteService%22,%22foreign_id%22:{{entry.values.id}}%7D">{{entry.values.flag_count}}</a>',
                    'label' => 'Flags',
                ) ,
                3 => array(
                    'name' => 'is_active',
                    'label' => 'Active?',
                    'type' => 'boolean',
                ) ,
            ) ,
            'title' => 'Service Flag Categories',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'edit',
                1 => 'show',
                2 => 'delete',
            ) ,
            'batchActions' => array(
                0 => 'delete',
                1 => '<batch-adminactive type="active" action="flag_categories" selection="selection"></batch-adminactive>',
                2 => '<batch-admininactive type="inactive" action="flag_categories" selection="selection"></batch-admininactive>'
            ) ,
            'filters' => array(
                0 => array(
                    'name' => 'q',
                    'pinned' => true,
                    'label' => 'Search',
                    'type' => 'template',
                    'template' => '',
                ) ,
                1 => array(
                    'name' => 'filter',
                    'type' => 'choice',
                    'label' => 'Active',
                    'choices' => array(
                        0 => array(
                            'label' => 'Active',
                            'value' => 'active',
                        ) ,
                        1 => array(
                            'label' => 'Inactive',
                            'value' => 'inactive',
                        ) ,
                    ) ,
                ) ,
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch',
                1 => 'filter',
                2 => 'create',
            ) ,
        ) ,
        'creationview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'name',
                    'label' => 'Name',
                    'type' => 'string',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                1 => array(
                    'name' => 'is_active',
                    'label' => 'Active?',
                    'type' => 'choice',
                    'defaultValue' => false,
                    'validation' => array(
                        'required' => true,
                    ) ,
                    'choices' => array(
                        0 => array(
                            'label' => 'Yes',
                            'value' => true,
                        ) ,
                        1 => array(
                            'label' => 'No',
                            'value' => false,
                        ) ,
                    ) ,
                ) ,
            ) ,
            'prepare' => array(
                'class' => 'QuoteService'
            )
        ) ,
        'editionview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'name',
                    'label' => 'Name',
                    'type' => 'string',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                1 => array(
                    'name' => 'is_active',
                    'label' => 'Active?',
                    'type' => 'choice',
                    'defaultValue' => false,
                    'validation' => array(
                        'required' => true,
                    ) ,
                    'choices' => array(
                        0 => array(
                            'label' => 'Yes',
                            'value' => true,
                        ) ,
                        1 => array(
                            'label' => 'No',
                            'value' => false,
                        ) ,
                    ) ,
                ) ,
            ) ,
            'prepare' => array(
                'class' => 'QuoteService'
            )
        ) ,
        'showview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'id',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'name',
                    'label' => 'Name',
                ) ,
                2 => array(
                    'name' => 'flag_count',
                    'template' => '<a href="#/service_flags/list?search=%7B%22class%22:%22QuoteService%22,%22foreign_id%22:{{entry.values.id}}%7D">{{entry.values.flag_count}}</a>',
                    'label' => 'Flags',
                ) ,
                3 => array(
                    'name' => 'is_active',
                    'label' => 'Active?',
                    'type' => 'boolean'
                ) ,
            ) ,
        ) ,
    ) ,
    'service_reviews' => array(
        'listview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'foreign_review_model.name',
                    'label' => 'Service',
                ) ,
                2 => array(
                    'name' => 'user.username',
                    'label' => 'Reviewed By',
                ) ,
                3 => array(
                    'name' => 'other_user.username',
                    'label' => 'Reviewed To',
                ) ,
                4 => array(
                    'name' => 'rating',
                    'label' => 'Rating',
                    'template' => '<star-rating stars="{{entry.values.rating}}"></star-rating>',
                ) ,
                5 => array(
                    'name' => 'message',
                    'label' => 'Message',
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                ) ,
                6 => array(
                    'name' => 'quote_bid.private_note_of_incomplete',
                    'label' => 'Private Note',
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                ) ,
                7 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
            'title' => 'Service Reviews',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'edit',
                1 => 'show',
                2 => 'delete',
            ) ,
            'batchActions' => array(
                0 => 'delete',
            ) ,
            'filters' => array(
                0 => array(
                    'name' => 'q',
                    'pinned' => true,
                    'label' => 'Search',
                    'type' => 'template',
                    'template' => '',
                ) ,
                1 => array(
                    'name' => 'user_id',
                    'label' => 'User',
                    'targetEntity' => 'users',
                    'targetField' => 'username',
                    'map' => array(
                        0 => 'truncate',
                    ) ,
                    'type' => 'reference',
                    'remoteComplete' => true,
                ) ,
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch'
            ) ,
        ) ,
        'creationview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'rating',
                    'label' => 'Rating',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                1 => array(
                    'name' => 'message',
                    'label' => 'Message',
                ) ,
            ) ,
        ) ,
        'editionview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'editable' => false
                ) ,
                1 => array(
                    'name' => 'foreign_review_model.name',
                    'label' => 'Service',
                    'editable' => false
                ) ,
                2 => array(
                    'name' => 'user.username',
                    'label' => 'Reviewed By',
                    'editable' => false
                ) ,
                3 => array(
                    'name' => 'other_user.username',
                    'label' => 'Reviewed To',
                    'editable' => false
                ) ,
                4 => array(
                    'name' => 'rating',
                    'label' => 'Rating',
                    'validation' => array(
                        'required' => true,
                    ) ,
                ) ,
                5 => array(
                    'name' => 'message',
                    'label' => 'Review',
                    'type' => 'text',
                    'validation' => array(
                        'required' => false,
                    ) ,
                ) ,
            ) ,
            'prepare' => array(
                'class' => 'QuoteBid'
            )
        ) ,
        'showview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'isDetailLink' => true,
                ) ,
                1 => array(
                    'name' => 'foreign_review_model.name',
                    'label' => 'Service',
                ) ,
                2 => array(
                    'name' => 'user.username',
                    'label' => 'Reviewed By',
                ) ,
                3 => array(
                    'name' => 'other_user.username',
                    'label' => 'Reviewed To',
                ) ,
                4 => array(
                    'name' => 'rating',
                    'label' => 'Rating',
                    'template' => '<star-rating stars="{{entry.values.rating}}"></star-rating>',
                ) ,
                5 => array(
                    'name' => 'message',
                    'label' => 'Message'
                ) ,
                6 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
            'title' => 'Service Reviews',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'edit',
                1 => 'show',
                2 => 'delete',
            ) ,
            'batchActions' => array(
                0 => 'delete',
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch'
            ) ,
        ) ,
    ) ,
    'service_views' => array(
        'listview' => array(
            'fields' => array(
                0 => array(
                    'name' => 'id',
                    'label' => 'ID',
                    'template' => '<a href="#/service_views/show/{{entry.values.id}}">{{entry.values.id}}</a>',
                ) ,
                1 => array(
                    'name' => 'foreign_view.business_name',
                    'label' => 'Service',
                ) ,
                2 => array(
                    'name' => 'user.username',
                    'label' => 'User',
                ) ,
                3 => array(
                    'name' => 'created_at',
                    'label' => 'Created On',
                ) ,
            ) ,
            'title' => 'Service Views',
            'perPage' => '10',
            'sortField' => '',
            'sortDir' => '',
            'infinitePagination' => false,
            'listActions' => array(
                0 => 'delete'
            ) ,
            'batchActions' => array(
                0 => 'delete',
            ) ,
            'permanentFilters' => '',
            'actions' => array(
                0 => 'batch'
            ) ,
        ) ,
    ) ,
);
$dashboard = array(
    'quote_requests' => array(
        'addCollection' => array(
            'fields' => array(
                0 => array(
                    'name' => 'user.username',
                    'label' => 'User',
                ) ,
                1 => array(
                    'name' => 'quote_category.name',
                    'label' => 'Category',
                ) ,
                2 => array(
                    'name' => 'title',
                    'label' => 'Title',
                ) ,
                3 => array(
                    'name' => 'full_address',
                    'label' => 'Work Location',
                ) ,
            ) ,
            'title' => 'Recent Requests',
            'name' => 'recent_requests',
            'perPage' => 5,
            'order' => 6,
            'template' => '<div class="col-lg-6"><div class="panel"><ma-dashboard-panel collection="dashboardController.collections.recent_requests" entries="dashboardController.entries.recent_requests" datastore="dashboardController.datastore"></ma-dashboard-panel></div></div>'
        )
    ) ,
    'quote_services' => array(
        'addCollection' => array(
            'fields' => array(
                0 => array(
                    'name' => 'user.username',
                    'label' => 'User'
                ) ,
                1 => array(
                    'name' => 'business_name',
                    'label' => 'Title'
                ) ,
                2 => array(
                    'name' => 'full_address',
                    'label' => 'Service Location'
                ) ,
                3 => array(
                    'name' => 'quote_service_photo_count',
                    'label' => 'Photos',
                    'template' => '<a href="#/quote_service_photos/list?search=%7B%22quote_service_id%22:{{entry.values.id}}%7D">{{entry.values.quote_service_photo_count}}</a>',
                ) ,
                4 => array(
                    'name' => 'quote_service_video_count',
                    'label' => 'Videos',
                    'template' => '<a href="#/quote_service_videos/list?search=%7B%22quote_service_id%22:{{entry.values.id}}%7D">{{entry.values.quote_service_video_count}}</a>',
                ) ,
                5 => array(
                    'name' => 'quote_faq_answer_count',
                    'label' => 'FAQs',
                    'template' => '<a href="#/quote_faq_answers/list?search=%7B%22quote_service_id%22:{{entry.values.id}}%7D">{{entry.values.quote_faq_answer_count}}</a>'
                ) ,
            ) ,
            'title' => 'Recent Services',
            'name' => 'recent_services',
            'perPage' => 5,
            'order' => 2,
            'template' => '<div class="col-lg-6"><div class="panel"><ma-dashboard-panel collection="dashboardController.collections.recent_services" entries="dashboardController.entries.recent_services" datastore="dashboardController.datastore"></ma-dashboard-panel></div></div>'
        )
    )
);
if (isPluginEnabled('Quote/QuoteSeviceFlag')) {
    $portfolio_menu = array(
        'Services' => array(
            'title' => 'Services',
            'icon_template' => '<span class="fa fa-cogs"></span>',
            'child_sub_menu' => array(
                'service_flags' => array(
                    'title' => 'Service Flags',
                    'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                    'suborder' => 5
                )
            )
        )
    );
    $menus = merged_menus($menus, $portfolio_menu);
}
if (isPluginEnabled('Quote/QuoteSeviceFlag')) {
    $portfolio_menu = array(
        'Master' => array(
            'title' => 'Master',
            'icon_template' => '<span class="glyphicon glyphicon-dashboard"></span>',
            'child_sub_menu' => array(
                'service_flag_categories' => array(
                    'title' => 'Service Flag Categories',
                    'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                    'suborder' => 27
                )
            )
        )
    );
    $menus = merged_menus($menus, $portfolio_menu);
}
if (isPluginEnabled('Quote/QuoteReview')) {
    $portfolio_menu = array(
        'Services' => array(
            'title' => 'Services',
            'icon_template' => '<span class="fa fa-cogs"></span>',
            'child_sub_menu' => array(
                'service_reviews' => array(
                    'title' => 'Service Reviews',
                    'icon_template' => '<span class="glyphicon glyphicon-log-out"></span>',
                    'suborder' => 6
                )
            )
        )
    );
    $menus = merged_menus($menus, $portfolio_menu);
}
if (isPluginEnabled('Common/Flag')) {
    $service_table = array(
        'quote_services' => array(
            'listview' => array(
                'fields' => array(
                    14 => array(
                        'name' => 'flag_count',
                        'label' => 'Flags',
                        'template' => '<a href="#/service_flags/list?search=%7B%22class%22:%22QuoteService%22,%22foreign_id%22:{{entry.values.id}}%7D">{{entry.values.flag_count}}</a>'
                    )
                )
            ) ,
            'showview' => array(
                'fields' => array(
                    18 => array(
                        'name' => 'flag_count',
                        'label' => 'Flags',
                        'template' => '<a href="#/service_flags/list?search=%7B%22class%22:%22QuoteService%22,%22foreign_id%22:{{entry.values.id}}%7D">{{entry.values.flag_count}}</a>'
                    )
                )
            )
        )
    );
    $tables = merge_details($tables, $service_table);
}
