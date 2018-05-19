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
/**
 * GET QuotebidsGet
 * Summary: all Quotebid lists
 * Notes: all Quotebid lists
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_bids', '_getQuoteBids')->add(new ACL('canAdminListQuoteBid'));
/**
 * POST Quotebids POST
 * Summary:Post Quotebids
 * Notes:  Post Quotebids
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/quote_bids', function ($request, $response, $args) {
    $args = $request->getParsedBody();
    $quoteBids = new Models\QuoteBid;
    foreach ($args as $key => $arg) {
        $quoteBids->{$key} = $arg;
    }
    $result = array();
    try {
        $validationErrorFields = $quoteBids->validate($args);
        if (empty($validationErrorFields)) {
            $quoteBids->save();
            $result['data'] = $quoteBids->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Quote Bid could not be added. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Quote Bid could not be added. Please, try again.', '', 1);
    }
});
/**
 * DELETE Quote bids QuotebidIdDelete
 * Summary: Delete Quotebids
 * Notes: Deletes a single Quotebid based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/quote_bids/{quoteBidId}', function ($request, $response, $args) {
    $quoteBids = Models\QuoteBid::find($request->getAttribute('quoteBidId'));
    $result = array();
    try {
        if (!empty($quoteBids)) {
            $quoteBids->delete();
            quoteRequestTableUpdationForQuoteBid($quoteBids->quote_request_id);
            $result = array(
                'status' => 'success',
            );
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Quote Bid could not be deleted. Please, try again.', '', 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Quote Bid could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteQuoteBid'));
/**
 * GET QuotebidQuotebidId get
 * Summary: Fetch a Quotebid based on Quotebid Id
 * Notes: Returns a Quotebid from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_bids/{quoteBidId}', function ($request, $response, $args) {
    global $authUser;
    $result = array();
    $enabledIncludes = array(
        'user',
        'quote_status',
        'quote_service',
        'quote_request',
        'service_provider_user'
    );
    $quoteBids = Models\QuoteBid::with($enabledIncludes)->find($request->getAttribute('quoteBidId'));
    if (!empty($quoteBids)) {
        $result['data'] = $quoteBids->toArray();
        return renderWithJson($result);
    } else {
        return renderWithJson($result, 'No record found', '', 1);
    }
})->add(new ACL('canViewQuoteBid'));
/**
 * PUT QuoteBid QuoteBidIdPut
 * Summary: Update QuoteBid details
 * Notes: Update QuoteBid details.
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/quote_bids/{quoteBidId}', function ($request, $response, $args) {
    global $authUser;
    $args = $request->getParsedBody();
    $result = array();
    $quoteBids = Models\QuoteBid::find($request->getAttribute('quoteBidId'));
    try {
        $oldQuoteBidStatus = $newQuoteBidStatus = $quoteBids->quote_status_id;
        $oldQuoteBidAmount = $newQuoteBidAmount = $quoteBids->quote_amount;
        if ($quoteBids->service_provider_user_id == $authUser['id'] && !empty($args['quote_status_id']) && $oldQuoteBidStatus == \Constants\QuoteStatus::NewBid && $args['quote_status_id'] != \Constants\QuoteStatus::NotInterested) {
            if ((isPluginEnabled('Common/Subscription')) && CREDIT_POINT_FOR_SENDING_QUOTE_FOR_REQUEST > 0) {
                $User = Models\User::find($authUser['id']);
                $UserCount = $User->makeVisible('available_credit_count');
                $user_count = $UserCount->toArray();
                if ($user_count['available_credit_count'] >= CREDIT_POINT_FOR_SENDING_QUOTE_FOR_REQUEST) {
                    $quoteCreditPurchaseLog = Models\CreditPurchaseLog::with('quote_credit_purchase_plan')->where('user_id', $authUser['id'])->where('is_active', true)->where('is_payment_completed', true)->first();
                    if ($quoteCreditPurchaseLog) {
                        $User->available_credit_count = $user_count['available_credit_count'] - CREDIT_POINT_FOR_SENDING_QUOTE_FOR_REQUEST;
                        $User->save();
                        $quoteBids->quote_status_id = \Constants\QuoteStatus::UnderDiscussion;
                        $quoteBids->used_credit_count = CREDIT_POINT_FOR_SENDING_QUOTE_FOR_REQUEST;
                        $quoteBids->credit_purchase_log_id = $quoteCreditPurchaseLog->id;
                        $quoteCreditPurchaseLog->used_credit_count = $quoteCreditPurchaseLog->used_credit_count + CREDIT_POINT_FOR_SENDING_QUOTE_FOR_REQUEST;
                        if ($quoteCreditPurchaseLog->used_credit_count >= $quoteCreditPurchaseLog->credit_count) {
                            $quoteCreditPurchaseLog->is_active = 0;
                            $emailFindReplace = array(
                                '##USER##' => ucfirst($User->username) ,
                                '##PLAN_NAME##' => $quoteCreditPurchaseLog->quote_credit_purchase_plan->name
                            );
                            sendMail('Credit plan expired', $emailFindReplace, $User->email);
                        }
                        $quoteCreditPurchaseLog->save();
                    }
                } else {
                    return renderWithJson($result, "You don't have enough amount in your available credit count.", '', 1);
                }
            }
        }
        $service_provider_allowed_field = array(
            "quote_amount",
            "quote_type",
            "price_note",
            "quote_status_id",
            "is_requestor_readed",
            "is_provider_readed"
        );
        $service_provider_allowed_status = array(
            \Constants\QuoteStatus::UnderDiscussion,
            \Constants\QuoteStatus::Completed,
            \Constants\QuoteStatus::NotInterested
        );
        $service_provider_allowed_type = array(
            \Constants\QuoteStatus::NewBid,
            \Constants\QuoteStatus::UnderDiscussion,
            \Constants\QuoteStatus::Closed
        );
        if (!empty($args['quote_status_id'] && $oldQuoteBidStatus == \Constants\QuoteStatus::NewBid && $args['quote_status_id'] == \Constants\QuoteStatus::UnderDiscussion)) {
            if (SENDING_QUOTE_REQUEST_FLOW_TYPE == 'Limited Quote Per Limited Period') {
                $isOpenBidTimeReached = 1;
                $now = date('Y-m-d h:i:s');
                $addedTimeLimit = date('Y-m-d h:i:s', strtotime($quoteBids->quote_request->created_at . "+" . TIME_LIMIT_AFTER_OTHER_PROVIDER_GET_QUOTE_REQUEST . " hours"));
                if ($addedTimeLimit <= $now) {
                    $isOpenBidTimeReached = 0;
                }
                $quoteBids->is_first_level_quote_request = 0;
                $existingCount = Models\QuoteBid::where('quote_request_id', $quoteBids->quote_request_id)->where('quote_status_id', \Constants\QuoteStatus::UnderDiscussion)->count();
                if (empty($args['is_okay_with_delay_quote']) && $existingCount >= QUOTE_VISIBLE_LIMIT && !$isOpenBidTimeReached) {
                    return renderWithJson($result, 'Maximum quote limit exceeded', '', 2);
                } else {
                    if ($existingCount < QUOTE_VISIBLE_LIMIT && !$isOpenBidTimeReached) {
                        $quoteBids->is_first_level_quote_request = 1;
                        if (!empty($args['is_okay_with_delay_quote']) && $existingCount <= QUOTE_VISIBLE_LIMIT && !$isOpenBidTimeReached) {
                            $quoteBids->is_show_bid_to_requestor = 0;
                        }
                    }
                }
            }
        }
        foreach ($args as $key => $arg) {
            if ((($authUser['role_id'] == \Constants\ConstUserTypes::Admin || $quoteBids->service_provider_user_id == $authUser['id']) && in_array($key, $service_provider_allowed_field))) {
                if ($key == 'quote_status_id' && in_array($arg, $service_provider_allowed_status)) {
                    $quoteBids->{$key} = $arg;
                }
                if ($key == 'quote_type' && in_array($quoteBids->quote_status_id, $service_provider_allowed_type)) {
                    $quoteBids->{$key} = $arg;
                }
                if ($key == 'quote_amount' && in_array($quoteBids->quote_status_id, $service_provider_allowed_type)) {
                    $quoteBids->{$key} = $arg;
                }
                if ($key == 'price_note') {
                    $quoteBids->{$key} = $arg;
                }
            } elseif (($authUser['role_id'] == \Constants\ConstUserTypes::Admin || $quoteBids->user_id == $authUser['id']) && ($key == 'quote_status_id' && $arg == \Constants\QuoteStatus::Hired)) {
                $quoteBids->{$key} = $arg;
            } elseif (($authUser['role_id'] == \Constants\ConstUserTypes::Admin || $quoteBids->user_id == $authUser['id']) && ($key == 'quote_status_id' && $arg == \Constants\QuoteStatus::Closed && $quoteBids->quote_status_id == \Constants\QuoteStatus::Completed)) {
                $quoteBids->{$key} = $arg;
            } elseif (($authUser['role_id'] == \Constants\ConstUserTypes::Admin || $quoteBids->user_id == $authUser['id']) && !empty($quoteBids->quote_request->is_request_for_buy) && ($key == 'quote_status_id' && $arg == \Constants\QuoteStatus::Closed)) {
                $quoteBids->{$key} = $arg;
            } elseif (($authUser['role_id'] == \Constants\ConstUserTypes::Admin || $quoteBids->user_id == $authUser['id']) && $key == "private_note_of_incomplete") {
                $quoteBids->{$key} = $arg;
            } elseif (($authUser['role_id'] == \Constants\ConstUserTypes::Admin || $quoteBids->user_id == $authUser['id']) && ($key == 'quote_status_id' && $arg == \Constants\QuoteStatus::NotCompleted && in_array($quoteBids->quote_status_id, [\Constants\QuoteStatus::Hired, \Constants\QuoteStatus::Completed]))) {
                $quoteBids->{$key} = $arg;
            }
            if ($authUser->id == $quoteBids->service_provider_user_id && $key == 'is_provider_readed') {
                $quoteBids->is_provider_readed = $arg;
            } elseif ($authUser->id == $quoteBids->user_id && $key == 'is_requestor_readed') {
                $quoteBids->is_requestor_readed = $arg;
            }
        }
        if ($quoteBids->quote_status_id == \Constants\QuoteStatus::Hired) {
            $quoteBids->hired_on = date('Y-m-d H:i:s');
        } elseif ($quoteBids->quote_status_id == \Constants\QuoteStatus::Completed) {
            $quoteBids->completed_on = date('Y-m-d H:i:s');
        } elseif ($quoteBids->quote_status_id == \Constants\QuoteStatus::Closed || $quoteBids->quote_status_id == \Constants\QuoteStatus::NotCompleted) {
            $quoteBids->closed_on = date('Y-m-d H:i:s');
        }
        if ($quoteBids->save()) {
            $newQuoteBidStatus = $quoteBids->quote_status_id;
            $newQuoteBidAmount = $quoteBids->quote_amount;
            $userId = $quoteBids->user_id;
            $otherUserId = $quoteBids->service_provider_user_id;
            if ($authUser->id == $quoteBids->service_provider_user_id) {
                $userId = $quoteBids->service_provider_user_id;
                $otherUserId = $quoteBids->user_id;
            }
            if (isset($args['quote_status_id']) && $args['quote_status_id'] >= $quoteBids->quote_status_id && $oldQuoteBidStatus != $newQuoteBidStatus) {
                if ($newQuoteBidStatus != \Constants\QuoteStatus::NotInterested) {
                    insertActivities($userId, $otherUserId, 'QuoteBid', $quoteBids->id, $oldQuoteBidStatus, $newQuoteBidStatus, \Constants\ActivityType::QuoteBidStatusChanged, $quoteBids->quote_service_id, $quoteBids->quote_amount);
                } 
                quoteRequestTableUpdationForQuoteBid($quoteBids->quote_request_id);
            }
            if ($oldQuoteBidAmount != $newQuoteBidAmount && !(!empty($args['quote_status_id'] && $oldQuoteBidStatus == \Constants\QuoteStatus::NewBid && $args['quote_status_id'] == \Constants\QuoteStatus::UnderDiscussion))) {
                insertActivities($userId, $otherUserId, 'QuoteBid', $quoteBids->id, 0, 0, \Constants\ActivityType::QuoteBidAmountChanged, $quoteBids->quote_service_id, $quoteBids->quote_amount);
            }
            if ($oldQuoteBidStatus != $newQuoteBidStatus || $oldQuoteBidAmount != $newQuoteBidAmount) {
                if ($authUser->id == $quoteBids->service_provider_user_id) {
                    $quoteBids->is_requestor_readed = 0;
                    $quoteBids->save();
                } elseif ($authUser->id == $quoteBids->user_id) {
                    $quoteBids->is_provider_readed = 0;
                    $quoteBids->save();
                }
            }
            if ($oldQuoteBidStatus == \Constants\QuoteStatus::NewBid && $quoteBids->quote_status_id == \Constants\QuoteStatus::UnderDiscussion && !empty($quoteBids->price_note)) {
                $otherUserId = $quoteBids->user_id;
                $receivedMessageCount = $quoteBids->requestor_received_message_count + 1;
                $unreadedMessageCount = Models\Message::where('foreign_id', $quoteBids->id)->where('class', 'QuoteBid')->where('other_user_id', $otherUserId)->whereNull('is_read')->count();
                $quoteBids->requestor_received_message_count = $quoteBids->requestor_received_message_count + 1;
                $quoteBids->requestor_unread_message_count = $unreadedMessageCount;
                $quoteBids->is_requestor_readed = 0;
                $quoteBids->save();
                $messageContent = new Models\MessageContent;
                $messageContent->message = $quoteBids->price_note;
                $messageContent->subject = $quoteBids->quote_request->quote_category->name;
                $messageContent->save();
                saveMessage(0, '', $authUser->id, $otherUserId, $messageContent->id, 0, 'QuoteBid', $quoteBids->id, 1, $quoteBids->quote_service_id, 1);
            }
            $enabledIncludes = array(
                'user',
                'quote_service',
                'quote_request'
            );
            $quoteBids = Models\QuoteBid::with($enabledIncludes)->where('id', $request->getAttribute('quoteBidId'))->first();
            global $_server_domain_url;
            if (!empty($args['quote_status_id']) && ($quoteBids->quote_status_id == \Constants\QuoteStatus::Hired || $quoteBids->quote_status_id == \Constants\QuoteStatus::Closed)) {
                $userDetails = getUserHiddenFields($quoteBids->service_provider_user_id);
                $quoteStatusName = Models\QuoteStatus::getQuoteStatusSlugNameById($quoteBids->quote_status_id);
                $emailFindReplace = array(
                    '##FREELANCER##' => $userDetails->username,
                    '##EMPLOYER##' => $quoteBids->user->username,
                    '##REQUEST_NAME##' => $quoteBids->quote_request->title,
                    '##RESPONSE_URL##' => $_server_domain_url . '/my_works/' . $quoteBids->quote_status_id . '/' . $quoteStatusName . '/' . $quoteBids->id
                );
                if ($quoteBids->quote_status_id == \Constants\QuoteStatus::Hired) {
                    $template = 'Hired Notification';
                } else {
                    Models\User::where('id', $quoteBids->service_provider_user_id)->update(['available_wallet_amount' => $userDetails->available_wallet_amount + ($quoteBids->quote_amount)]);                    
                    insertTransaction($quoteBids->service_provider_user_id, $quoteBids->user_id, $quoteBids->id, 'QuoteBid', \Constants\TransactionType::QuoteSubscriptionPlan, \Constants\PaymentGateways::Wallet, $quoteBids->quote_amount, 0, 0, 0, 0, $quoteBids->id, 0);                   
                    $template = 'Work Closed Notification';
                }
                sendMail($template, $emailFindReplace, $userDetails->email);
            } elseif ($oldQuoteBidStatus == \Constants\QuoteStatus::NewBid && $quoteBids->quote_status_id == \Constants\QuoteStatus::UnderDiscussion) {
                $userDetails = getUserHiddenFields($quoteBids->service_provider_user_id);
                $employerDetails = getUserHiddenFields($quoteBids->user_id);
                $quoteStatusName = Models\QuoteStatus::getQuoteStatusSlugNameById($quoteBids->quote_status_id);
                $quoteTypes = array(
                    '1' => 'Flat Rate',
                    '2' => 'Hourly Rate',
                    '3' => 'More Information Required'
                );
                $quoteType = $quoteTypes[$quoteBids->quote_type];
                $emailFindReplace = array(
                    '##FREELANCER##' => ucfirst($userDetails->username) ,
                    '##EMPLOYER##' => ucfirst($employerDetails->username) ,
                    '##REQUEST_NAME##' => $quoteBids->quote_request->title,
                    '##QUOTE_AMOUNT##' => $quoteBids->quote_amount,
                    '##PRICE_TYPE##' => $quoteType,
                    '##CATEGORY_NAME##' => $quoteBids->quote_request->quote_category->name,
                    '##BUSINESS_NAME##' => $quoteBids->quote_service->business_name,
                    '##PAYMENT_NOTE##' => $quoteBids->price_note,
                    '##RESPONSE_URL##' => $_server_domain_url . '/my_works/' . $quoteBids->quote_status_id . '/' . $quoteStatusName . '/' . $quoteBids->id
                );
                sendMail('Quote Received Notification', $emailFindReplace, $employerDetails->email);
            } elseif (!empty($args['quote_status_id']) && (($quoteBids->quote_status_id == \Constants\QuoteStatus::UnderDiscussion && $quoteBids->is_show_bid_to_requestor == 1) || $quoteBids->quote_status_id == \Constants\QuoteStatus::Completed)) {
                $employerDetails = getUserHiddenFields($quoteBids->user_id);
                $userDetails = getUserHiddenFields($quoteBids->service_provider_user_id);
                $quoteStatusName = Models\QuoteStatus::getQuoteStatusSlugNameById($quoteBids->quote_status_id);
                $quoteTypes = array(
                    '1' => 'Flat Rate',
                    '2' => 'Hourly Rate',
                    '3' => 'More Information Required'
                );
                $quoteType = $quoteTypes[$quoteBids->quote_type];
                $emailFindReplace = array(
                    '##FREELANCER##' => ucfirst($userDetails->username) ,
                    '##EMPLOYER##' => ucfirst($employerDetails->username) ,
                    '##BUSINESS_NAME##' => $quoteBids->quote_service->business_name,
                    '##REQUEST_NAME##' => $quoteBids->quote_request->title,
                    '##QUOTE_AMOUNT##' => $quoteBids->quote_amount,
                    '##PRICE_TYPE##' => $quoteType,
                    '##RESPONSE_URL##' => $_server_domain_url . '/my_works/' . $quoteBids->quote_status_id . '/' . $quoteStatusName . '/' . $quoteBids->id
                );
                if ($quoteBids->quote_status_id == \Constants\QuoteStatus::UnderDiscussion) {
                    $template = 'Quote Updated Notification';
                } else {
                    $template = 'Work Completed Notification';
                }
                sendMail($template, $emailFindReplace, $employerDetails->email);
            } elseif (!empty($args['quote_status_id']) && ($quoteBids->quote_status_id == \Constants\QuoteStatus::NotCompleted ) && $oldQuoteBidStatus != $newQuoteBidStatus) {
                $employerDetails = getUserHiddenFields($quoteBids->user_id);
                $userDetails = getUserHiddenFields($quoteBids->service_provider_user_id);
                $quoteStatusName = Models\QuoteStatus::getQuoteStatusSlugNameById($quoteBids->quote_status_id);
                $quoteType = $quoteTypes[$quoteBids->quote_type];
                $emailFindReplace = array(
                    '##FREELANCER##' => ucfirst($userDetails->username) ,
                    '##EMPLOYER##' => ucfirst($employerDetails->username) ,
                    '##REQUEST_NAME##' => $quoteBids->quote_request->title,
                    '##RESPONSE_URL##' => $_server_domain_url . '/my_works/' . $quoteBids->quote_status_id . '/' . $quoteStatusName . '/' . $quoteBids->id
                );
                sendMail('Work Incomplete Notification', $emailFindReplace, $employerDetails->email);                
            }
            $result['data'] = $quoteBids->toArray();
            return renderWithJson($result);
        }
        throw new Exception('validation error');
    } catch (Exception $e) {
        return renderWithJson($result, 'Quote Bid could not be updated. Please, try again', '', 1);
    }
})->add(new ACL('canUpdateQuoteBid'));
;
/**
 * GET QuoteBid based on serviceProviderId Get
 * Summary: all QuoteBid lists based on serviceProviderId
 * Notes: all QuoteBid lists
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/service_providers/{serviceProviderUserId}/quote_bids', '_getQuoteBids')->add(new ACL('canGetquoteBid'));
/**
 * GET Quotebid QuoteRequestId get
 * Summary: Fetch a Quotebid based on quoteRequestId
 * Notes: Returns a Quotebid from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/requestor/{requestorId}/quote_bids', '_getQuoteBids')->add(new ACL('canListQuoteBid'));
/**
 * GET QuoteCategoryGet
 * Summary: all QuoteCategory lists
 * Notes: all QuoteCategory lists
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_categories', function ($request, $response, $args) {
    $queryParams = $request->getQueryParams();
    $count = PAGE_LIMIT;
    if (!empty($queryParams['limit'])) {
        $count = $queryParams['limit'];
    }
    $result = array();
    try {
        $count = PAGE_LIMIT;
        if (!empty($queryParams['limit'])) {
            $count = $queryParams['limit'];
        }
        $enabledIncludes = array(
            'attachment',
            'form_field_groups'
        );
        $quoteCategories = Models\QuoteCategory::with($enabledIncludes)->where('is_active', 1)->filter($queryParams)->paginate($count)->toArray();
        if (!empty($queryParams['limit']) && $queryParams['limit'] == 'all') {
            $quoteCategories['data'] = Models\QuoteCategory::with($enabledIncludes)->Filter($queryParams)->get();
        } elseif (!empty($queryParams['filter'])) {
            $quoteCategories = Models\QuoteCategory::with($enabledIncludes)->filter($queryParams)->paginate($count)->toArray();
        }
        $data = $quoteCategories['data'];
        unset($quoteCategories['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $quoteCategories
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * POST QuoteCategory POST
 * Summary:Post QuoteCategory
 * Notes:  Post QuoteCategory
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/quote_categories', function ($request, $response, $args) {
    $args = $request->getParsedBody();
    $quoteCategories = new Models\QuoteCategory($args);
    if (empty($quoteCategories->parent_category_id)) {
        unset($quoteCategories->parent_category_id);
    }
    $result = array();
    $quoteCategories->slug = Inflector::slug(strtolower($quoteCategories->name), '-');
    try {
        $validationErrorFields = $quoteCategories->validate($args);
        if (empty($validationErrorFields)) {
            $quoteCategories->save();
            if (!empty($args['image'])) {
                saveImage('QuoteCategory', $args['image'], $quoteCategories->id);
            }
            if (!empty($args['image_data'])) {
                saveImageData('QuoteCategory', $args['image_data'], $quoteCategories->id);
            }
            if (!empty($args['form_field_groups'])) {
                foreach ($args['form_field_groups'] as $formFieldGroups) {
                    $formFieldGroup = new Models\FormFieldGroup;
                    $formFieldGroup->name = $formFieldGroups['name'];
                    $formFieldGroup->slug = Inflector::slug(strtolower($formFieldGroups['name']), '-');
                    $formFieldGroup->class = 'QuoteCategory';
                    $formFieldGroup->foreign_id = $quoteCategories->id;
                    $formFieldGroup->save();
                    if (!empty($formFieldGroups['form_fields'])) {
                        foreach ($formFieldGroups['form_fields'] as $formFields) {
                            $formField = new Models\FormField($formFields);
                            $formField->class = 'QuoteCategory';
                            $formField->form_field_group_id = $formFieldGroup->id;
                            $formField->foreign_id = $quoteCategories->id;
                            $formField->save();
                        }
                    }
                }
            }
            $result['data'] = $quoteCategories->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Quote Category could not be added. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Quote Category could not be added. Please, try again.', '', 1);
    }
})->add(new ACL('canCreateQuoteCategory'));
/**
 * DELETE QuoteCategory QuoteCategoryIdDelete
 * Summary: Delete QuoteCategory
 * Notes: Deletes a single QuoteCategory based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/quote_categories/{quoteCategoryId}', function ($request, $response, $args) {
    $quoteCategories = Models\QuoteCategory::find($request->getAttribute('quoteCategoryId'));
    $result = array();
    try {
        if (!empty($quoteCategories)) {
            $quoteCategories->delete();
            $result = array(
                'status' => 'success',
            );
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Quote Category could not be deleted. Please, try again.', '', 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Quote Category could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteQuoteCategory'));
/**
 * GET QuoteCategory QuoteCategoryId get
 * Summary: Fetch a QuoteCategory based on QuoteCategory Id
 * Notes: Returns a QuoteCategory from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_categories/{quoteCategoryId}', function ($request, $response, $args) {
    $enabledIncludes = array(
        'attachment',
        'form_field_groups'
    );
    $quoteCategories = Models\QuoteCategory::with($enabledIncludes)->find($request->getAttribute('quoteCategoryId'));
    $result = array();
    if (!empty($quoteCategories)) {
        $result['data'] = $quoteCategories->toArray();
        return renderWithJson($result);
    } else {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * PUT QuoteCategory QuoteCategoryIdPut
 * Summary: Update QuoteCategory details
 * Notes: Update QuoteCategory details.
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/quote_categories/{quoteCategoryId}', function ($request, $response, $args) {
    $args = $request->getParsedBody();
    $result = array();
    $quoteCategories = Models\QuoteCategory::find($request->getAttribute('quoteCategoryId'));
    $validationErrorFields = $quoteCategories->validate($args);
    if (empty($validationErrorFields)) {
        $quoteCategories->fill($args);
        if (empty($quoteCategories->parent_category_id)) {
            $quoteCategories->parent_category_id = null;
        }
        try {
            $quoteCategories->save();
            if (!empty($args['image'])) {
                saveImage('QuoteCategory', $args['image'], $quoteCategories->id);
            }
            if (!empty($args['image_data'])) {
                saveImageData('QuoteCategory', $args['image_data'], $quoteCategories->id);
            }
            Models\FormField::where('class', 'QuoteCategory')->where('foreign_id', $quoteCategories->id)->delete();
            Models\FormFieldGroup::where('class', 'QuoteCategory')->where('foreign_id', $quoteCategories->id)->delete();
            if (!empty($args['form_field_groups'])) {
                foreach ($args['form_field_groups'] as $formFieldGroups) {
                    $formFieldGroup = new Models\FormFieldGroup;
                    $formFieldGroup->name = $formFieldGroups['name'];
                    $formFieldGroup->slug = Inflector::slug(strtolower($formFieldGroups['name']), '-');
                    $formFieldGroup->class = 'QuoteCategory';
                    $formFieldGroup->foreign_id = $quoteCategories->id;
                    $formFieldGroup->save();
                    if (!empty($formFieldGroups['form_fields'])) {
                        foreach ($formFieldGroups['form_fields'] as $formFields) {
                            $formField = new Models\FormField($formFields);
                            $formField->class = 'QuoteCategory';
                            $formField->form_field_group_id = $formFieldGroup->id;
                            $formField->foreign_id = $quoteCategories->id;
                            $formField->save();
                        }
                    }
                }
            }
            $result['data'] = $quoteCategories->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'Quote Category could not be updated. Please, try again', '', 1);
        }
    } else {
        return renderWithJson($result, 'Quote Category could not be updated. Please, try again', $validationErrorFields, 1);
    }
})->add(new ACL('canUpdateQuoteCategory'));
/**
 * GET quoteCategoriesQuoteServicesGet
 * Summary: Fetch all quote categories quote services
 * Notes: Returns all quote categories quote services from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_categories_quote_services', function ($request, $response, $args) {
    $queryParams = $request->getQueryParams();
    $results = array();
    $count = PAGE_LIMIT;
    try {
        if (!empty($queryParams['limit'])) {
            $count = $queryParams['limit'];
        }
        $enabledIncludes = array(
            'quote_categories'
        );
        if (!empty($queryParams['limit']) && $queryParams['limit'] == 'all') {
            $results['data'] = Models\QuoteCategoriesQuoteService::with($enabledIncludes)->Filter($queryParams)->get()->toArray();
        } else {
            $quoteCategoriesQuoteServices = Models\QuoteCategoriesQuoteService::with($enabledIncludes)->Filter($queryParams)->paginate($count)->toArray();
            $data = $quoteCategoriesQuoteServices['data'];
            unset($quoteCategoriesQuoteServices['data']);
            $results = array(
                'data' => $data,
                '_metadata' => $quoteCategoriesQuoteServices
            );
        }
        return renderWithJson($results);
    } catch (Exception $e) {
        return renderWithJson($results, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * GET QuoteFaqAnswerGet
 * Summary: all QuoteFaqAnswer lists
 * Notes: all QuoteFaqAnswer lists
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_faq_answers', '_getQuoteAnswerView');
/**
 * POST QuoteFaqAnswer POST
 * Summary:PostQuoteFaqAnswer
 * Notes:  Post QuoteFaqAnswer
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/quote_faq_answers', function ($request, $response, $args) {
    global $authUser;
    $args = $request->getParsedBody();
    $quoteFaqAnswers = new Models\QuoteFaqAnswer($args);
    $result = array();
    try {
        $validationErrorFields = $quoteFaqAnswers->validate($args);
        if (empty($validationErrorFields)) {
            $serviceOwnerId = Models\QuoteService::find($args['quote_service_id']);
            if ($authUser['role_id'] == 1 || $authUser['id'] == $serviceOwnerId['user_id']) {
                if ($args['question'] == "") {
                    $quoteFaqAnswers->quote_user_faq_question_id = null;
                }
                if (!empty($args['question'])) {
                    $quoteUserQuestion = new Models\QuoteUserFaqQuestion;
                    $quoteUserQuestion->question = $quoteFaqAnswers->question;
                    $quoteUserQuestion->user_id = $authUser['id'];
                    $quoteUserQuestion->save();
                    $quoteFaqAnswers->quote_user_faq_question_id = $quoteUserQuestion->id;
                    $quoteFaqAnswers->quote_faq_question_template_id = null;
                }
                unset($quoteFaqAnswers->question);
                $quoteFaqAnswers->save();
                quoteTableCountUpdation('QuoteFaqAnswer', 'quote_faq_answer_count', $quoteFaqAnswers->quote_service_id, 0);
            } else {
                return renderWithJson($result, 'Authorization required.', '', 1);
            }
            $result['data'] = $quoteFaqAnswers->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'QuoteFaqAnswer could not be added. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'QuoteFaqAnswer could not be added. Please, try again.', '', 1);
    }
})->add(new ACL('canPostQuoteFaqAnswer'));
/**
 * DELETE QuoteFaqAnswer QuoteFaqAnswerIdDelete
 * Summary: Delete  QuoteFaqAnswer
 * Notes: Deletes a single  QuoteFaqAnswer based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/quote_faq_answers/{quoteFaqAnswerId}', function ($request, $response, $args) {
    global $authUser;
    $quoteFaqAnswers = Models\QuoteFaqAnswer::find($request->getAttribute('quoteFaqAnswerId'));
    try {
        $serviceOwnerId = Models\QuoteService::find($quoteFaqAnswers->quote_service_id);
        if ($authUser['role_id'] == 1 || $authUser['id'] == $serviceOwnerId['user_id']) {
            $quoteFaqAnswers->delete();
            quoteTableCountUpdation('QuoteFaqAnswer', 'quote_faq_answer_count', $quoteFaqAnswers->quote_service_id, 0);
        } else {
            return renderWithJson($result, 'Authorization required.', '', 1);
        }
        $result = array(
            'status' => 'success',
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, 'QuoteCreditPurchasePlan could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteQuoteFaqAnswerId'));
/**
 * GET QuoteFaqAnswerQuoteFaqAnswerId get
 * Summary: Fetch a QuoteFaqAnswer based on QuoteFaqAnswer Id
 * Notes: Returns a QuoteFaqAnswer from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_faq_answers/{quoteFaqAnswerId}', '_getQuoteAnswerView')->add(new ACL('canGetQuoteFaqAnswerId'));
/**
 * PUT QuoteFaqAnswer QuoteFaqAnswerIdPut
 * Summary: Update QuoteFaqAnswer details
 * Notes: Update QuoteFaqAnswer details.
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/quote_faq_answers/{quoteFaqAnswerId}', function ($request, $response, $args) {
    global $authUser;
    $args = $request->getParsedBody();
    $result = array();
    $quoteFaqAnswers = Models\QuoteFaqAnswer::find($request->getAttribute('quoteFaqAnswerId'));
    $validationErrorFields = $quoteFaqAnswers->validate($args);
    if (empty($validationErrorFields)) {
        $quoteFaqAnswers->fill($args);
        try {
            $serviceOwnerId = Models\QuoteService::find($args['quote_service_id']);
            if ($authUser['role_id'] == 1 || $authUser['id'] == $serviceOwnerId['user_id']) {
                if ($args['question'] == "") {
                    $quoteFaqAnswers->quote_user_faq_question_id = null;
                }
                unset($quoteFaqAnswers->question);
                $quoteFaqAnswers->save();
                quoteTableCountUpdation('QuoteFaqAnswer', 'quote_faq_answer_count', $quoteFaqAnswers->quote_service_id, 0);
            } else {
                return renderWithJson($result, 'Authorization required.', '', 1);
            }
            $result['data'] = $quoteFaqAnswers->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'QuoteFaqAnswer could not be updated. Please, try again', '', 1);
        }
    } else {
        return renderWithJson($result, 'QuoteFaqAnswer could not be updated. Please, try again', $validationErrorFields, 1);
    }
})->add(new ACL('canUpdateQuoteFaqAnswerId'));
/**
 * GET QuoteUserFaqQuestion quoteServiceId get
 * Summary: Fetch a QuoteUserFaqQuestion based on quoteServiceId}
 * Notes: Returns aQuoteUserFaqQuestion from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_services/{quoteServiceId}/quote_faq_answers', '_getQuoteAnswerView');
/**
 * GET QuoteFaqQuestionTemplateGet
 * Summary: all QuoteFaqQuestionTemplate lists
 * Notes: all QuoteFaqQuestionTemplate lists
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_faq_question_templates', function ($request, $response, $args) {
    $queryParams = $request->getQueryParams();
    $result = array();
    try {
        $count = PAGE_LIMIT;
        if (!empty($queryParams['limit'])) {
            $count = $queryParams['limit'];
        }
        $quoteFaqQuestionTemplates = Models\QuoteFaqQuestionTemplate::Filter($queryParams);
        if (empty($queryParams['filter'])) {
            $quoteFaqQuestionTemplates = $quoteFaqQuestionTemplates->where('is_active', 1);
        }
        if (!empty($queryParams['limit']) && $queryParams['limit'] == 'all') {
            $quoteFaqQuestionTemplates = $quoteFaqQuestionTemplates->get()->toArray();
            $result = array(
                'data' => $quoteFaqQuestionTemplates
            );
        } else {
            $quoteFaqQuestionTemplates = $quoteFaqQuestionTemplates->paginate($count)->toArray();
            $data = $quoteFaqQuestionTemplates['data'];
            unset($quoteFaqQuestionTemplates['data']);
            $result = array(
                'data' => $data,
                '_metadata' => $quoteFaqQuestionTemplates
            );
        }
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canGetQuoteFaqQuestionTemplate'));
/**
 * POST QuoteFaqQuestionTemplate POST
 * Summary:PostQuoteFaqQuestionTemplate
 * Notes:  Post QuoteFaqQuestionTemplate
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/quote_faq_question_templates', function ($request, $response, $args) {
    $args = $request->getParsedBody();
    $quoteFaqQuestionTemplates = new Models\QuoteFaqQuestionTemplate($args);
    $result = array();
    try {
        $validationErrorFields = $quoteFaqQuestionTemplates->validate($args);
        if (empty($validationErrorFields)) {
            $quoteFaqQuestionTemplates->save();
            $result['data'] = $quoteFaqQuestionTemplates->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Quote Faq Question Template could not be added. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Quote Faq Question Template could not be added. Please, try again.', '', 1);
    }
})->add(new ACL('canPostQuoteFaqQuestionTemplate'));
/**
 * DELETE QuoteFaqQuestionTemplate QuoteFaqQuestionTemplateIdDelete
 * Summary: Delete QuoteFaqQuestionTemplate
 * Notes: Deletes a single  QuoteFaqQuestionTemplate based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/quote_faq_question_templates/{quoteFaqQuestionTemplateId}', function ($request, $response, $args) {
    $quoteFaqQuestionTemplates = Models\QuoteFaqQuestionTemplate::find($request->getAttribute('quoteFaqQuestionTemplateId'));
    $result = array();
    try {
        if (!empty($quoteFaqQuestionTemplates)) {
            $quoteFaqQuestionTemplates->delete();
            $result = array(
                'status' => 'success',
            );
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Quote Faq QuestionTemplate could not be deleted. Please, try again.', '', 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Quote Faq QuestionTemplate could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteQuoteFaqQuestionTemplate'));
/**
 * GET QuoteFaqQuestionTemplate QuoteFaqQuestionTemplateId get
 * Summary: Fetch a QuoteFaqQuestionTemplate based on QuoteFaqQuestionTemplate Id
 * Notes: Returns a QuoteFaqQuestionTemplate from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_faq_question_templates/{quoteFaqQuestionTemplateId}', function ($request, $response, $args) {
    $quoteFaqQuestionTemplates = Models\QuoteFaqQuestionTemplate::find($request->getAttribute('quoteFaqQuestionTemplateId'));
    $result = array();
    if (!empty($quoteFaqQuestionTemplates)) {
        $result['data'] = $quoteFaqQuestionTemplates->toArray();
        return renderWithJson($result);
    } else {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canGetQuoteFaqQuestionTemplateId'));
/**
 * PUT QuoteFaqQuestionTemplate QuoteFaqQuestionTemplateIdPut
 * Summary: Update QuoteFaqQuestionTemplate details
 * Notes: Update QuoteFaqQuestionTemplaten details.
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/quote_faq_question_templates/{quoteFaqQuestionTemplateId}', function ($request, $response, $args) {
    $args = $request->getParsedBody();
    $result = array();
    $quoteFaqQuestionTemplates = Models\QuoteFaqQuestionTemplate::find($request->getAttribute('quoteFaqQuestionTemplateId'));
    $validationErrorFields = $quoteFaqQuestionTemplates->validate($args);
    if (empty($validationErrorFields)) {
        $quoteFaqQuestionTemplates->fill($args);
        try {
            $quoteFaqQuestionTemplates->save();
            $result['data'] = $quoteFaqQuestionTemplates->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'Quote Faq Question Template could not be updated. Please, try again', '', 1);
        }
    } else {
        return renderWithJson($result, 'Quote Faq Question Template could not be updated. Please, try again', $validationErrorFields, 1);
    }
})->add(new ACL('canUpdateQuoteFaqQuestionTemplate'));
/**
 * GET QuoteRequestFormFieldGet
 * Summary: all QuoteRequestFormField lists
 * Notes: all QuoteRequestFormField lists
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_request_form_fields', function ($request, $response, $args) {
    $queryParams = $request->getQueryParams();
    $count = PAGE_LIMIT;
    if (!empty($queryParams['limit'])) {
        $count = $queryParams['limit'];
    }
    $result = array();
    try {
        $count = PAGE_LIMIT;
        if (!empty($queryParams['limit'])) {
            $count = $queryParams['limit'];
        }
        $enabledIncludes = array(
            'form_field',
            'quote_request'
        );
        $quoteRequestFormFields = Models\QuoteRequestFormField::with($enabledIncludes)->Filter($queryParams)->paginate($count)->toArray();
        $data = $quoteRequestFormFields['data'];
        unset($quoteRequestFormFields['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $quoteRequestFormFields
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canListQuoteRequestFormField'));
/**
 * DELETE QuoteRequestFormField QuoteRequestFormFieldIdDelete
 * Summary: Delete QuoteRequestFormField
 * Notes: Deletes a single QuoteRequestFormField based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/quote_request_form_fields/{quoteRequestFormFieldId}', function ($request, $response, $args) {
    $quoteRequestFormFields = Models\QuoteRequestFormField::find($request->getAttribute('quoteRequestFormFieldId'));
    try {
        $quoteRequestFormFields->delete();
        $result = array(
            'status' => 'success',
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, 'Quote Request Form Field could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteQuoteRequestFormField'));
/**
 * GET QuoteRequestFormField QuoteRequestFormFieldId get
 * Summary: Fetch a QuoteRequestFormField based on QuoteRequestFormField Id
 * Notes: Returns a QuoteFormField from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_request_form_fields/{quoteRequestFormFieldId}', function ($request, $response, $args) {
    $enabledIncludes = array(
        'form_field',
        'quote_request'
    );
    $quoteRequestFormFields = Models\QuoteRequestFormField::with($enabledIncludes)->find($request->getAttribute('quoteRequestFormFieldId'));
    $result['data'] = $quoteRequestFormFields->toArray();
    return renderWithJson($result);
})->add(new ACL('canViewQuoteRequestFormField'));
/**
 * PUT QuoteRequestFormField QuoteRequestFormFieldIdPut
 * Summary: Update QuoteRequestFormField details
 * Notes: Update QuoteRequestFormField details.
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/quote_request_form_fields/{quoteRequestFormFieldId}', function ($request, $response, $args) {
    $args = $request->getParsedBody();
    $result = array();
    $quoteRequestFormFields = Models\QuoteRequestFormField::find($request->getAttribute('quoteRequestFormFieldId'));
    $validationErrorFields = $quoteRequestFormFields->validate($args);
    if (empty($validationErrorFields)) {
        $quoteRequestFormFields->fill($args);
        try {
            $quoteRequestFormFields->save();
            $result['data'] = $quoteRequestFormFields->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'Quote Form Field could not be updated. Please, try again', '', 1);
        }
    } else {
        return renderWithJson($result, 'Quote Form Field could not be updated. Please, try again', $validationErrorFields, 1);
    }
})->add(new ACL('canUpdateQuoteRequestFormField'));
/**
 * GET QuoteRequestFormFieldGet
 * Summary: all QuoteRequestFormField lists
 * Notes: all QuoteRequestFormField lists
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_requests/{quoteRequestId}/quote_request_form_fields', function ($request, $response, $args) {
    $queryParams = $request->getQueryParams();
    $result = array();
    try {
        $enabledIncludes = array(
            'form_field',
            'quote_request'
        );
        $quoteRequestFormFields = Models\QuoteRequestFormField::with($enabledIncludes)->where('quote_request_id', $request->getAttribute('quoteRequestId'))->Filter($queryParams)->paginate(PAGE_LIMIT)->toArray();
        $data = $quoteRequestFormFields['data'];
        unset($quoteRequestFormFields['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $quoteRequestFormFields
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canListUserQuoteRequestFormField'));
/**
 * GET QuoteRequestGet
 * Summary: all QuoteRequestd lists
 * Notes: all QuoteRequest lists
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_requests', function ($request, $response, $args) {
    $queryParams = $request->getQueryParams();
    $result = array();
    try {
        $count = PAGE_LIMIT;
        if (!empty($queryParams['limit'])) {
            $count = $queryParams['limit'];
        }
        $enabledIncludes = array(
            'quote_category',
            'quote_bids',
            'user',
            'quote_service',
            'city',
            'state',
            'country',
            'form_field_submission'
        );
        $quoteRequests = Models\QuoteRequest::with($enabledIncludes)->Filter($queryParams)->paginate($count)->toArray();
        $data = $quoteRequests['data'];
        unset($quoteRequests['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $quoteRequests
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canListQuoteRequest'));
/**
 * POST QuoteRequest POST
 * Summary:Post QuoteRequest
 * Notes:  Post QuoteRequest
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/quote_requests', function ($request, $response, $args) {
    global $authUser;
    $result = array();
    $args = $request->getParsedBody();
    $queryParams = $request->getQueryParams();
    if (!in_array($authUser->role_id, [\Constants\ConstUserTypes::User, \Constants\ConstUserTypes::Employer]) && $authUser->role_id != \Constants\ConstUserTypes::Admin) {
        return renderWithJson($result, 'Freelancer could not be added the quote request.', '', 1);
    }
    if (!empty(ALLOWED_SERVICE_LOCATIONS)) {
        $allowed_location_status = 0;
        $allowed_locations = json_decode(ALLOWED_SERVICE_LOCATIONS);
        if (!empty($args['country_iso2']) && !empty($allowed_locations->allowed_countries)) {
            if (!in_array($args['country_iso2'], array_column(json_decode(json_encode($allowed_locations->allowed_countries), true), 'iso_alpha2'))) {
                $allowed_location_status = 1;
            }
        }
        if (!empty($args['city_name']) && !empty($allowed_locations->allowed_cities)) {
            if (!in_array($args['city_name'], array_column(json_decode(json_encode($allowed_locations->allowed_cities), true), 'name'))) {
                $allowed_location_status = 1;
            }
        }
        if (!empty($allowed_location_status)) {
            return renderWithJson($result, 'Address is not allowed', '', 2);
        }
    }
    $quoteRequests = new Models\QuoteRequest($args);
    $quoteRequests->user_id = $authUser['id'];
    $quoteRequests->country_id = findCountryIdFromIso2($args['country_iso2']);
    $quoteRequests->state_id = findOrSaveAndGetStateId($args['state_name'], $quoteRequests->country_id);
    $quoteRequests->city_id = findOrSaveAndGetCityId($args['city_name'], $quoteRequests->country_id, $quoteRequests->state_id);
    unset($quoteRequests->city_name);
    unset($quoteRequests->state_name);
    unset($quoteRequests->country_iso2);
    $quoteRequests->radius = $queryParams['radius'];
    $allowuUserTypes = array(
        \Constants\ConstUserTypes::Admin,
        \Constants\ConstUserTypes::User,
        \Constants\ConstUserTypes::Employer
    );
    if (!in_array($authUser['role_id'], $allowuUserTypes)) {
        return renderWithJson($result, "You're not eligible to access", '', 1);
    }
    $quoteCategory = array();
    try {
        $validationErrorFields = $quoteRequests->validate($args);
        if (empty($validationErrorFields)) {
            if (!isset($args['country_iso2'])) {
                $validationErrorFields['country_iso2'] = array();
                array_push($validationErrorFields['country_iso2'], 'country_iso2');
            }
            if (!isset($args['city_name'])) {
                $validationErrorFields['city_name'] = array();
                array_push($validationErrorFields['city_name'], 'city_name');
            }
            $country_id = $quoteRequests->country_id = findCountryIdFromIso2($args['country_iso2']);
            if (isset($quoteRequests->country_id)) {
                $quoteRequests->state_id = findOrSaveAndGetStateId($args['state_name'], $quoteRequests->country_id);
                $quoteRequests->city_id = findOrSaveAndGetCityId($args['city_name'], $quoteRequests->country_id, $quoteRequests->state_id);
            } else {
                $validationErrorFields['country_iso2'] = array();
                array_push($validationErrorFields['country_iso2'], 'country_iso2');
            }
            if (!empty($validationErrorFields)) {
                return renderWithJson($result, 'Quote Request could not be added. Please, try again.', $validationErrorFields, 1);
            }
            if (SENDING_QUOTE_REQUEST_FLOW_TYPE == 'Limited Quote Per Limited Period') {
                $quoteRequests->is_updated_bid_visibility_to_requestor = 0;
            }
            if ($quoteRequests->save()) {
                quoteCategoriesTabeCountUpdation('QuoteRequest', 'quote_request_count', $quoteRequests->quote_category_id);
                Models\User::where('id', $quoteRequests->user_id)->increment('quote_request_count', 1);
                if (!empty($args['form_field_submissions']) && $quoteRequests->id) {
                    foreach ($args['form_field_submissions'] as $formFieldSubmissions) {
                        foreach ($formFieldSubmissions as $field_name => $value) {
                            $formField = Models\FormField::where('name', $field_name)->select('id')->first();
                            if (!empty($formField)) {
                                $formFieldSubmission = new Models\FormFieldSubmission;
                                $formFieldSubmission->response = $value;
                                $formFieldSubmission->form_field_id = $formField->id;
                                $formFieldSubmission->foreign_id = $quoteRequests->id;
                                $formFieldSubmission->class = 'QuoteRequest';
                                $formFieldSubmission->save();
                            }
                        }
                    }
                }
            }
            $enabledIncludes = array(
                'quote_category',
                'quote_bids',
                'city',
                'state',
                'country',
                'form_field_submission'
            );
            $quoteRequests = Models\QuoteRequest::with($enabledIncludes)->find($quoteRequests->id);
            $result['data'] = $quoteRequests->toArray();            
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Quote Request could not be added. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Quote Request could not be added. Please, try again.', '', 1);
    }
})->add(new ACL('canCreateQuoteRequest'));
/**
 * GET QuoteRequest QuoteRequestId get
 * Summary: Fetch a QuoteRequest based on QuoteRequest Id
 * Notes: Returns a QuoteRequest from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_requests/{quoteRequestId}', function ($request, $response, $args) {
    $enabledIncludes = array(
        'quote_category',
        'quote_bids',
        'user',
        'quote_service',
        'city',
        'state',
        'country',
        'form_field_submission'
    );
    $quoteRequests = Models\QuoteRequest::with($enabledIncludes)->find($request->getAttribute('quoteRequestId'));
    $result['data'] = $quoteRequests->toArray();
    return renderWithJson($result);
});
/**
 * DELETE QuoteRequest QuoteRequestIdDelete
 * Summary: Delete QuoteRequest
 * Notes: Deletes a single QuoteRequest based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/quote_requests/{quoteRequestId}', function ($request, $response, $args) {
    $quoteRequests = Models\QuoteRequest::find($request->getAttribute('quoteRequestId'));
    $result = array();
    try {
        if ($quoteRequests->delete()) {
            quoteCategoriesTabeCountUpdation('QuoteRequest', 'quote_request_count', $quoteRequests->quote_category_id);
            Models\User::where('id', $quoteRequests->user_id)->decrement('quote_request_count', 1);
            $result = array(
                'status' => 'success',
            );
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Your not authorized peson', '', 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Quote Request could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteQuoteRequest'));
/**
 * PUT QuoteRequestQuoteRequestIdPut
 * Summary: Update QuoteRequestd details
 * Notes: Update QuoteRequest details.
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/quote_requests/{quoteRequestId}', function ($request, $response, $args) {
    global $authUser;
    $args = $request->getParsedBody();
    $result = array();
    $quoteRequests = Models\QuoteRequest::find($request->getAttribute('quoteRequestId'));
    $allowuUserTypes = array(
        \Constants\ConstUserTypes::Admin,
        \Constants\ConstUserTypes::User,
        \Constants\ConstUserTypes::Employer
    );
    if (!in_array($authUser['role_id'], $allowuUserTypes)) {
        return renderWithJson($result, "You're not eligible to access", '', 1);
    }
    $validationErrorFields = $quoteRequests->validate($args);
    if (empty($validationErrorFields)) {
        $quoteRequests->fill($args);
        if (!empty($args['country_iso2'])) {
            $quoteRequests->country_id = findCountryIdFromIso2($args['country_iso2']);
            $quoteRequests->state_id = findOrSaveAndGetStateId($args['state_name'], $quoteRequests->country_id);
            $quoteRequests->city_id = findOrSaveAndGetCityId($args['city_name'], $quoteRequests->country_id, $quoteRequests->state_id);
            unset($quoteRequests->city_name);
            unset($quoteRequests->state_name);
            unset($quoteRequests->country_iso2);
        }
        if ($authUser['id'] != $quoteRequests->user_id && $authUser['role_id'] != \Constants\ConstUserTypes::Admin) {
            unset($quoteRequests->is_archived);
        }
        try {
            $quoteRequests->save();
            quoteCategoriesTabeCountUpdation('QuoteRequest', 'quote_request_count', $quoteRequests->quote_category_id);
            if (!empty($args['form_field_submissions']) && $quoteRequests->id) {
                foreach ($args['form_field_submissions'] as $formFieldSubmissions) {
                    foreach ($formFieldSubmissions as $fieldName => $value) {
                        $formField = Models\FormField::where('name', $fieldName)->select('id')->first();
                        if (!empty($formField)) {
                            $FormFieldSubmission = Models\FormFieldSubmission::where('foreign_id', $quoteRequests->id)->where('form_field_id', $formField->id)->select('id')->first();
                            if (!empty($FormFieldSubmission)) {
                                $FormFieldSubmission = Models\FormFieldSubmission::where('id', $FormFieldSubmission->id)->update(array(
                                    'response' => $value
                                ));
                            } else {
                                $formFieldSubmission = new Models\FormFieldSubmission;
                                $formFieldSubmission->response = $value;
                                $formFieldSubmission->form_field_id = $formField->id;
                                $formFieldSubmission->foreign_id = $quoteRequests->id;
                                $formFieldSubmission->class = 'QuoteRequest';
                                $formFieldSubmission->save();
                            }
                        }
                    }
                }
            }
            $enabledIncludes = array(
                'form_field_submission'
            );
            $quoteRequests = Models\QuoteRequest::with($enabledIncludes)->find($quoteRequests->id);
            $result['data'] = $quoteRequests->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'Quote Request could not be updated. Please, try again', '', 1);
        }
    } else {
        return renderWithJson($result, 'Quote Request could not be updated. Please, try again', $validationErrorFields, 1);
    }
})->add(new ACL('canUpdateQuoteRequest'));
/**
 * GET QuoteRequestGet
 * Summary: all QuoteRequestd lists
 * Notes: all QuoteRequest lists
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/me/quote_requests', function ($request, $response, $args) {
    global $authUser;
    $queryParams = $request->getQueryParams();
    $result = array();
    try {
        if (!empty($authUser)) {
            $enabledIncludes = array(
                'quote_category',
                'user',
                'quote_service',
                'city',
                'state',
                'country',
                'form_field_submission'
            );
            $quoteRequests = Models\QuoteRequest::with($enabledIncludes)->where('user_id', $authUser['id'])->Filter($queryParams)->paginate(PAGE_LIMIT)->toArray();
            $data = $quoteRequests['data'];
            unset($quoteRequests['data']);
            $result = array(
                'data' => $data,
                '_metadata' => $quoteRequests
            );
            return renderWithJson($result);
        } else {
            return renderWithJson($result, $message = 'Your not authorized user', $fields = '', $isError = 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canListMyQuoteRequest'));
/**
 * GET QuoteServices
 * Summary: all QuoteServices
 * Notes: all QuoteServices
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_services', '_getQuoteService');
/**
 * GET QuoteServices
 * Summary: all QuoteServices
 * Notes: all QuoteServices
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/me/quote_services', function ($request, $response, $args) {
    global $authUser;
    $queryParams = $request->getQueryParams();
    $results = array();
    try {
        if (!empty($authUser)) {
            $count = PAGE_LIMIT;
            if (!empty($queryParams['limit'])) {
                $count = $queryParams['limit'];
            }
            $enabledIncludes = array(
                'user',
                'attachment',
                'city',
                'state',
                'country'
            );
            $quoteServices = Models\QuoteService::with($enabledIncludes)->where('user_id', $authUser['id'])->Filter($queryParams)->paginate($count)->toArray();
            if (!empty($queryParams['filter'])) {
                $quoteServices = Models\QuoteService::with($enabledIncludes)->where('user_id', $authUser['id'])->Filter($queryParams)->paginate($count)->toArray();
            }
            if (!empty($queryParams['latitude']) && !empty($queryParams['longitude'])) {
                $lat = $latitude = $queryParams['latitude'];
                $lng = $longitude = $queryParams['longitude'];
                $radius = isset($queryParams['radius']) ? $queryParams['radius'] : 5;
                $distance = 'ROUND(( 6371 * acos( cos( radians(' . $latitude . ') ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(' . $longitude . ')) + sin( radians(' . $latitude . ') ) * sin( radians( latitude ) ) )))';
                $quoteServices = Models\QuoteService::with($enabledIncludes)->select('services.*')->selectRaw($distance . ' AS distance')->whereRaw('(' . $distance . ')<=' . $radius)->where('user_id', $authUser['id'])->paginate($count)->toArray();
            }
            $data = $quoteServices['data'];
            unset($quoteServices['data']);
            $results = array(
                'data' => $data,
                '_metadata' => $quoteServices
            );
            return renderWithJson($results);
        } else {
            return renderWithJson($results, 'No record found', '', 1);
        }
    } catch (Exception $e) {
        return renderWithJson($results, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canViewMyQuoteService'));
/**
 * POST QuoteService POST
 * Summary:Post QuoteService
 * Notes:  Post QuoteService
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/quote_services', function ($request, $response, $args) {
    global $authUser;
    $result = array();
    $args = $request->getParsedBody();
    if (!in_array($authUser->role_id, [\Constants\ConstUserTypes::User, \Constants\ConstUserTypes::Freelancer]) && $authUser->role_id != \Constants\ConstUserTypes::Admin) {
        return renderWithJson($result, 'Employer could not be added the quote service.', '', 1);
    }
    $quoteServices = new Models\QuoteService($args);
    $quoteServices->slug = Inflector::slug(strtolower($quoteServices->name), '-');
    if (!empty(ALLOWED_SERVICE_LOCATIONS)) {
        $allowed_location_status = 0;
        $allowed_locations = json_decode(ALLOWED_SERVICE_LOCATIONS);
        if (!empty($args['country_iso2']) && !empty($allowed_locations->allowed_countries)) {
            if (!in_array($args['country_iso2'], array_column(json_decode(json_encode($allowed_locations->allowed_countries), true), 'iso_alpha2'))) {
                $allowed_location_status = 1;
            }
        }
        if (!empty($args['city_name']) && !empty($allowed_locations->allowed_cities)) {
            if (!in_array($args['city_name'], array_column(json_decode(json_encode($allowed_locations->allowed_cities), true), 'name'))) {
                $allowed_location_status = 1;
            }
        }
        if (!empty($allowed_location_status)) {
            return renderWithJson($result, 'Address is not allowed', '', 2);
        }
    }
    //get country, state and city ids
    $args['country_id'] = $quoteServices->country_id = findCountryIdFromIso2($args['country_iso2']);
    if ($quoteServices->country_id) {
        $args['state_id'] = $quoteServices->state_id = findOrSaveAndGetStateId($args['state_name'], $quoteServices->country_id);
        $args['city_id'] = $quoteServices->city_id = findOrSaveAndGetCityId($args['city_name'], $quoteServices->country_id, $quoteServices->state_id);
    } else {
        return renderWithJson($result, 'Quote Service could not be added. Please, try again.', 'Enter Valid Country Code', 1);
    }
    $allowuUserTypes = array(
        \Constants\ConstUserTypes::Admin,
        \Constants\ConstUserTypes::User,
        \Constants\ConstUserTypes::Freelancer
    );
    if (!in_array($authUser['role_id'], $allowuUserTypes)) {
        return renderWithJson($result, "You're not eligible to access", '', 1);
    }
    $quoteServices->user_id = $authUser['id'];
    if ($authUser['role_id'] == \Constants\ConstUserTypes::Admin && !empty($args['user_id'])) {
        $quoteServices->user_id = $args['user_id'];
    }
    if ($authUser['role_id'] != \Constants\ConstUserTypes::Admin) {
        unset($quoteServices->is_admin_suspend);
    }
    unset($quoteServices->city_name);
    unset($quoteServices->state_name);
    unset($quoteServices->country_iso2);
    try {
        $validationErrorFields = $quoteServices->validate($args);
        if (empty($validationErrorFields)) {
            $quoteServices->save();
            if (!empty($args['image'])) {
                saveImage('QuoteService', $args['image'], $quoteServices->id);
            }
            if (!empty($args['image_data'])) {
                saveImageData('QuoteService', $args['image_data'], $quoteServices->id);
            }
            // Add in the Quote Sevice Category table
            if (!empty($args['quote_categories']) && !empty($args['quote_categories'][0]['quote_category_id'] && $quoteServices->id)) {
                foreach ($args['quote_categories'] as $quote_category) {
                    $quoteCategoryQuoteService = Models\QuoteCategoryQuoteService::where('quote_category_id', $quote_category['quote_category_id'])->where('quote_service_id', $quoteServices->id)->first();
                    if (empty($quoteCategoryQuoteService)) {
                        $quoteServiceCategory = new Models\QuoteCategoryQuoteService;
                        $quoteServiceCategory->quote_category_id = $quote_category['quote_category_id'];
                        $quoteServiceCategory->quote_service_id = $quoteServices->id;
                        $quoteServiceCategory->save();
                    }
                }
            }
            $result['data'] = $quoteServices->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Quote Service could not be added. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Quote Service could not be added. Please, try again.', '', 1);
    }
})->add(new ACL('canAddQuoteService'));
/**
 * GET QuoteService QuoteServiceId get
 * Summary: Fetch a QuoteService based on QuoteService ID
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_services/{quoteServiceId}', '_getQuoteService');
/**
 * DELETE QuoteService QuoteServiceIdDelete
 * Summary: Delete QuoteService
 * Notes: Deletes a single QuoteService based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/quote_services/{quoteServiceId}', function ($request, $response, $args) {
    global $authUser;
    $quoteServices = Models\QuoteService::find($request->getAttribute('quoteServiceId'));
    try {
        if ($authUser['role_id'] == 1 || $authUser['id'] == $quoteServices->user_id) {
            $quoteServices->delete();
        } else {
            return renderWithJson($result, 'Authorization required. Please, try again.', '', 1);
        }
        $result = array(
            'status' => 'success',
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, 'Quote service could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteQuoteService'));
/**
 * PUT QuoteService QuoteServiceIdPut
 * Summary: Update QuoteService
 * Notes: Update QuoteService
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/quote_services/{quoteServiceId}', function ($request, $response, $args) {
    global $authUser;
    $args = $request->getParsedBody();
    $result = array();
    $quoteServices = Models\QuoteService::find($request->getAttribute('quoteServiceId'));
    $allowuUserTypes = array(
        \Constants\ConstUserTypes::Admin,
        \Constants\ConstUserTypes::User,
        \Constants\ConstUserTypes::Freelancer
    );
    if (!in_array($authUser['role_id'], $allowuUserTypes)) {
        return renderWithJson($result, "You're not eligible to access", '', 1);
    }
    if (!empty(ALLOWED_SERVICE_LOCATIONS)) {
        $allowed_location_status = 0;
        $allowed_locations = json_decode(ALLOWED_SERVICE_LOCATIONS);
        if (!empty($args['country_iso2']) && !empty($allowed_locations->allowed_countries)) {
            if (!in_array($args['country_iso2'], array_column(json_decode(json_encode($allowed_locations->allowed_countries), true), 'iso_alpha2'))) {
                $allowed_location_status = 1;
            }
        }
        if (!empty($args['city_name']) && !empty($allowed_locations->allowed_cities)) {
            if (!in_array($args['city_name'], array_column(json_decode(json_encode($allowed_locations->allowed_cities), true), 'name'))) {
                $allowed_location_status = 1;
            }
        }
        if (!empty($allowed_location_status)) {
            return renderWithJson($result, 'Address is not allowed', '', 2);
        }
    }
    $validationErrorFields = $quoteServices->validate($args);
    if (empty($validationErrorFields)) {
        $quoteServices->fill($args);
        $quoteServices->slug = Inflector::slug(strtolower($quoteServices->name), '-');
        //get country, state and city ids
        if (!empty($args['country_iso2'])) {
            $quoteServices->country_id = findCountryIdFromIso2($args['country_iso2']);
        }
        if (!empty($args['state_name'])) {
            $quoteServices->state_id = findOrSaveAndGetStateId($args['state_name'], $quoteServices->country_id);
        }
        if (!empty($args['city_name'])) {
            $quoteServices->city_id = findOrSaveAndGetCityId($args['city_name'], $quoteServices->country_id, $quoteServices->state_id);
        }
        if ($authUser['role_id'] == \Constants\ConstUserTypes::Admin && !empty($args['user_id'])) {
            $quoteServices->user_id = $args['user_id'];
        }
        if ($authUser['role_id'] != \Constants\ConstUserTypes::Admin) {
            unset($quoteServices->is_admin_suspend);
        }
        unset($quoteServices->city_name);
        unset($quoteServices->state_name);
        unset($quoteServices->country_iso2);
        try {
            $quoteServices->save();
            if (!empty($args['image'])) {
                saveImage('QuoteService', $args['image'], $quoteServices->id);
            }
            if (!empty($args['image_data'])) {
                saveImageData('QuoteService', $args['image_data'], $quoteServices->id);
            }
            if ($authUser['role_id'] == 1 || $authUser['id'] == $quoteServices->user_id) {
                $quoteServices->save();
                if (!empty($args['quote_categories'][0]['quote_category_id']) && !empty($args['quote_categories'] && $quoteServices->id)) {
                    Models\QuoteCategoryQuoteService::where('quote_service_id', $quoteServices->id)->delete();
                    foreach ($args['quote_categories'] as $quote_category) {
                        $quoteServiceCategory = new Models\QuoteCategoryQuoteService;
                        $quoteServiceCategory->quote_category_id = $quote_category['quote_category_id'];
                        $quoteServiceCategory->quote_service_id = $quoteServices->id;
                        $quoteServiceCategory->save();
                    }
                }
            } else {
                return renderWithJson($result, 'Authorization required. Please, try again.', '', 1);
            }
            $result['data'] = $quoteServices->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'Quote Service could not be updated. Please, try again', '', 1);
        }
    } else {
        return renderWithJson($result, 'Quote Service could not be updated. Please, try again', $validationErrorFields, 1);
    }
})->add(new ACL('canUpdateQuoteService'));
/**
 * GET QuoteServiceGet
 * Summary: all QuoteService
 * Notes: all QuoteService
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/users/{userId}/quote_services', '_getQuoteService');
/**
 * GET quoteStatusesGet
 * Summary: Fetch all quote statuses
 * Notes: Returns all quote statuses from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_statuses', function ($request, $response, $args) {
    $queryParams = $request->getQueryParams();
    $results = array();
    try {
        $quoteStatuses = Models\QuoteStatus::Filter($queryParams)->paginate(PAGE_LIMIT)->toArray();
        $data = $quoteStatuses['data'];
        unset($quoteStatuses['data']);
        $results = array(
            'data' => $data,
            '_metadata' => $quoteStatuses
        );
        return renderWithJson($results);
    } catch (Exception $e) {
        return renderWithJson($results, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * GET QuoteUserFaqQuestionGet
 * Summary: all QuoteUserFaqQuestion lists
 * Notes: all QuoteUserFaqQuestion lists
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_user_faq_questions', function ($request, $response, $args) {
    $queryParams = $request->getQueryParams();
    $result = array();
    try {
        $count = PAGE_LIMIT;
        if (!empty($queryParams['limit'])) {
            $count = $queryParams['limit'];
        }
        $enabledIncludes = array(
            'user'
        );
        $quoteUserFaqQuestions = Models\QuoteUserFaqQuestion::with($enabledIncludes)->Filter($queryParams)->paginate($count)->toArray();
        $data = $quoteUserFaqQuestions['data'];
        unset($quoteUserFaqQuestions['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $quoteUserFaqQuestions
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canListQuoteUserFaqQuestion'));
/**
 * POST QuoteUserFaqQuestion POST
 * Summary:PostQuoteUserFaqQuestion
 * Notes:  Post QuoteUserFaqQuestion
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/quote_user_faq_questions', function ($request, $response, $args) {
    $args = $request->getParsedBody();
    $quoteUserFaqQuestions = new Models\QuoteUserFaqQuestion;
    foreach ($args as $key => $arg) {
        $quoteUserFaqQuestions->{$key} = $arg;
    }
    $result = array();
    try {
        $validationErrorFields = $quoteUserFaqQuestions->validate($args);
        if (empty($validationErrorFields)) {
            $quoteUserFaqQuestions->save();
            $result['data'] = $quoteUserFaqQuestions->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'QuoteUserFaqQuestion could not be added. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'QuoteUserFaqQuestion could not be added. Please, try again.', '', 1);
    }
})->add(new ACL('canCreateQuoteUserFaqQuestion'));
/**
 * DELETE QuoteUserFaqQuestion QuoteUserFaqQuestionIdDelete
 * Summary: Delete QuoteUserFaqQuestion
 * Notes: Deletes a single  QuoteUserFaqQuestion based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/quote_user_faq_questions/{quoteUserFaqQuestionId}', function ($request, $response, $args) {
    $quoteUserFaqQuestions = Models\QuoteUserFaqQuestion::find($request->getAttribute('quoteUserFaqQuestionId'));
    try {
        $quoteUserFaqQuestions->delete();
        $result = array(
            'status' => 'success',
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, 'Quote User Faq Question could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteQuoteUserFaqQuestion'));
/**
 * GET QuoteUserFaqQuestion QuoteUserFaqQuestionId get
 * Summary: Fetch a QuoteFaqAnswer based on QuoteFaqAnswer Id
 * Notes: Returns a QuoteFaqAnswer from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_user_faq_questions/{quoteUserFaqQuestionId}', function ($request, $response, $args) {
    $enabledIncludes = array(
        'user'
    );
    $quoteUserFaqQuestions = Models\QuoteUserFaqQuestion::with($enabledIncludes)->find($request->getAttribute('quoteUserFaqQuestionId'));
    $result['data'] = $quoteUserFaqQuestions->toArray();
    return renderWithJson($result);
})->add(new ACL('canViewQuoteUserFaqQuestion'));
/**
 * PUT QuoteUserFaqQuestion QuoteUserFaqQuestionIdPut
 * Summary: Update QuoteUserFaqQuestion details
 * Notes: Update QuoteUserFaqQuestion details.
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/quote_user_faq_questions/{quoteUserFaqQuestionId}', function ($request, $response, $args) {
    global $authUser;
    $args = $request->getParsedBody();
    $result = array();
    $quoteUserFaqQuestions = Models\QuoteUserFaqQuestion::find($request->getAttribute('quoteUserFaqQuestionId'));
    $validationErrorFields = $quoteUserFaqQuestions->validate($args);
    if (empty($validationErrorFields)) {
        $quoteUserFaqQuestions->fill($args);
        try {
            $quoteUserFaqQuestions->user_id = $authUser['id'];
            $quoteUserFaqQuestions->save();
            $result['data'] = $quoteUserFaqQuestions->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'Quote User Faq Question could not be updated. Please, try again', '', 1);
        }
    } else {
        return renderWithJson($result, 'Quote User Faq Question could not be updated. Please, try again', $validationErrorFields, 1);
    }
})->add(new ACL('canUpdateQuoteUserFaqQuestion'));
/**
 * GET QuoteServiceVideo
 * Summary: all QuoteServiceVideo
 * Notes: all QuoteServiceVideo
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_service_videos', function ($request, $response, $args) {
    $queryParams = $request->getQueryParams();
    $count = PAGE_LIMIT;
    if (!empty($queryParams['limit'])) {
        $count = $queryParams['limit'];
    }
    $result = array();
    try {
        $count = PAGE_LIMIT;
        if (!empty($queryParams['limit'])) {
            $count = $queryParams['limit'];
        }
        $enabledIncludes = array(
            'quote_service'
        );
        $quoteServiceVideos = Models\QuoteServiceVideo::with($enabledIncludes)->Filter($queryParams)->paginate($count)->toArray();
        $data = $quoteServiceVideos['data'];
        unset($quoteServiceVideos['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $quoteServiceVideos
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canListQuoteServiceVideo'));
/**
 * POST QuoteServiceVideo POST
 * Summary:Post QuoteServiceVideo
 * Notes:  Post QuoteServiceVideo
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/quote_service_videos', function ($request, $response, $args) {
    global $authUser;
    $args = $request->getParsedBody();
    $result = array();
    $quoteServiceVideos = new Models\QuoteServiceVideo($args);
    try {
        $validationErrorFields = $quoteServiceVideos->validate($args);
        if (empty($validationErrorFields)) {
            $checkIsEmbedValid = getVideoEmbedCode($args['video_url']);
            if ($checkIsEmbedValid === 0) {
                return renderWithJson($result, "Site couldn\'t process your video URL. Please enter valid URL or some other URL.", "", 1);
            }
            $quoteServiceVideos->embed_code = $checkIsEmbedValid;
            if ($quoteServiceVideos->save()) {
                quoteTableCountUpdation('QuoteServiceVideo', 'quote_service_video_count', $quoteServiceVideos->quote_service_id, 0);
                $result['data'] = $quoteServiceVideos->toArray();
                return renderWithJson($result);
            } else {
                return renderWithJson($result, 'Your not authorized person', '', 1);
            }
            $result['data'] = $quoteServiceVideos->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Quote Service Video could not be added. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Quote Service Video could not be added. Please, try again.', '', 1);
    }
})->add(new ACL('canCreateQuoteServiceVideo'));
/**
 * GET QuoteServiceVideo QuoteServiceVideoId get
 * Summary: Fetch a QuoteServiceVideo based on QuoteServiceVideo Id
 * Notes: Returns aQuoteServicevideofrom the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_service_videos/{quoteServiceVideoId}', function ($request, $response, $args) {
    $result = array();
    try {
        $enabledIncludes = array(
            'quote_service'
        );
        $quoteServicVideos = Models\QuoteServiceVideo::with($enabledIncludes)->find($request->getAttribute('quoteServiceVideoId'));
        if (!empty($quoteServicVideos)) {
            $result['data'] = $quoteServicVideos->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canListQuoteServiceVideo'));
/**
 * DELETE QuoteServiceVideo QuoteServiceVideoIdDelete
 * Summary: Delete QuoteServiceVideo
 * Notes: Deletes a single QuoteServiceVideo based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/quote_service_videos/{quoteServiceVideoId}', function ($request, $response, $args) {
    $quoteServiceVideos = Models\QuoteServiceVideo::find($request->getAttribute('quoteServiceVideoId'));
    $result = array();
    try {
        if (!empty($quoteServiceVideos) && $quoteServiceVideos->delete()) {
            quoteTableCountUpdation('QuoteServiceVideo', 'quote_service_video_count', $quoteServiceVideos->quote_service_id, 0);
            $result = array(
                'status' => 'success',
            );
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Quote Service Videos could not be deleted. Please, try again', '', 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Quote Service Videos could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteQuoteServiceVideo'));
/**
 * PUT quoteServiceVideos quoteServiceVideosIdPut
 * Summary: Update QuoteRequestd details
 * Notes: Update QuoteRequest details.
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/quote_service_videos/{quoteServiceVideoId}', function ($request, $response, $args) {
    $args = $request->getParsedBody();
    $result = array();
    $enabledIncludes = array(
        'quote_service'
    );
    $quoteServiceVideos = Models\QuoteServiceVideo::with($enabledIncludes)->find($request->getAttribute('quoteServiceVideoId'));
    if (!empty($quoteServiceVideos)) {
        $validationErrorFields = $quoteServiceVideos->validate($args);
        if (empty($validationErrorFields)) {
            $quoteServiceVideos->fill($args);
            try {
                if (!empty($args['video_url'])) {
                    $checkIsEmbedValid = getVideoEmbedCode($args['video_url']);
                    if ($checkIsEmbedValid === 0) {
                        return renderWithJson($result, "Site couldn\'t process your video URL. Please enter valid URL or some other URL.", "", 1);
                    }
                    $quoteServiceVideos->embed_code = $checkIsEmbedValid;
                }
                if ($quoteServiceVideos->save()) {
                    quoteTableCountUpdation('QuoteServiceVideo', 'quote_service_video_count', $quoteServiceVideos->quote_service_id, 0);
                    $result['data'] = $quoteServiceVideos->toArray();
                    return renderWithJson($result);
                } else {
                    return renderWithJson($result, 'Your not authorized person', '', 1);
                }
            } catch (Exception $e) {
                return renderWithJson($result, 'Quote Service Video could not be updated. Please, try again', '', 1);
            }
        } else {
            return renderWithJson($result, 'Quote Service Video could not be updated. Please, try again', $validationErrorFields, 1);
        }
    } else {
        return renderWithJson($result, 'Quote Service Video could not be updated. Please, try again', '', 1);
    }
})->add(new ACL('canUpdateQuoteServiceVideo'));
/**
 * GET QuoteServiceVideoGet
 * Summary: all QuoteServiceVideo lists
 * Notes: all QuoteServiceVideo lists
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_services/{quoteServiceId}/quote_service_videos', function ($request, $response, $args) {
    $queryParams = $request->getQueryParams();
    $result = array();
    try {
        $enabledIncludes = array(
            'quote_service'
        );
        $quoteServiceVideos = Models\QuoteServiceVideo::where('quote_service_id', $request->getAttribute('quoteServiceId'))->with($enabledIncludes)->Filter($queryParams)->paginate(PAGE_LIMIT)->toArray();
        $data = $quoteServiceVideos['data'];
        unset($quoteServiceVideos['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $quoteServiceVideos
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * GET QuoteServicePhoto
 * Summary: all QuoteServicePhoto
 * Notes: all QuoteServicePhoto
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_service_photos', function ($request, $response, $args) {
    $queryParams = $request->getQueryParams();
    $count = PAGE_LIMIT;
    if (!empty($queryParams['limit'])) {
        $count = $queryParams['limit'];
    }
    $result = array();
    try {
        $count = PAGE_LIMIT;
        if (!empty($queryParams['limit'])) {
            $count = $queryParams['limit'];
        }
        $enabledIncludes = array(
            'quote_service',
            'attachment'
        );
        $quoteServicePhotos = Models\QuoteServicePhoto::with($enabledIncludes)->Filter($queryParams)->paginate($count)->toArray();
        $data = $quoteServicePhotos['data'];
        unset($quoteServicePhotos['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $quoteServicePhotos
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canListQuoteServicePhoto'));
/**
 * POST QuoteServicePhoto POST
 * Summary:Post QuoteServicePhoto
 * Notes:  Post QuoteServicePhoto
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/quote_service_photos', function ($request, $response, $args) {
    global $authUser;
    $args = $request->getParsedBody();
    $result = array();
    $quoteServicePhotos = new Models\QuoteServicePhoto($args);
    try {
        $validationErrorFields = $quoteServicePhotos->validate($args);
        if (empty($validationErrorFields)) {
            if ($quoteServicePhotos->save()) {
                if (!empty($args['image'] && $quoteServicePhotos->id)) {
                    saveImage('QuoteServicePhoto', $args['image'], $quoteServicePhotos->id);
                    quoteTableCountUpdation('QuoteServicePhoto', 'quote_service_photo_count', $quoteServicePhotos->quote_service_id, 0);
                }
                if (!empty($args['image_data'] && $quoteServicePhotos->id)) {
                    saveImageData('QuoteServicePhoto', $args['image_data'], $quoteServicePhotos->id);
                    quoteTableCountUpdation('QuoteServicePhoto', 'quote_service_photo_count', $quoteServicePhotos->quote_service_id, 0);
                }
                $result['data'] = $quoteServicePhotos->toArray();
                return renderWithJson($result);
            } else {
                return renderWithJson($result, 'You don\'t have permission ', '', 1);
            }
            $result['data'] = $quoteServicePhotos->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Quote Service Photo could not be added. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Quote Service Photo could not be added. Please, try again.', '', 1);
    }
})->add(new ACL('canCreateQuoteServicePhoto'));
/**
 * GET QuoteServicePhoto QuoteServicePhotoId get
 * Summary: Fetch a QuoteServicePhoto based on QuoteServicePhoto ID
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_service_photos/{quoteServicePhotoId}', function ($request, $response, $args) {
    $result = array();
    try {
        $enabledIncludes = array(
            'quote_service',
            'attachment'
        );
        $quoteServicePhotos = Models\QuoteServicePhoto::with($enabledIncludes)->find($request->getAttribute('quoteServicePhotoId'));
        if (!empty($quoteServicePhotos)) {
            $result['data'] = $quoteServicePhotos->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * DELETE QuoteServicePhoto QuoteServicePhotoIdDelete
 * Summary: Delete QuoteServicePhoto
 * Notes: Deletes a single QuoteServicePhoto based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/quote_service_photos/{quoteServicePhotoId}', function ($request, $response, $args) {
    $enabledIncludes = array(
        'quote_service'
    );
    $quoteServicePhotos = Models\QuoteServicePhoto::with($enabledIncludes)->find($request->getAttribute('quoteServicePhotoId'));
    $result = array();
    try {
        if (!empty($quoteServicePhotos) && $quoteServicePhotos->delete()) {
            quoteTableCountUpdation('QuoteServicePhoto', 'quote_service_photo_count', $quoteServicePhotos->quote_service_id, 0);
            $result = array(
                'status' => 'success',
            );
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Quote Service Photo could not be deleted. Please, try again', '', 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Quote Service Photo could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteQuoteServicePhoto'));
/**
 * PUT QuoteServicePhotoQuoteServicePhotoIdPut
 * Summary: Update QuoteServicePhoto
 * Notes: Update QuoteServicePhoto
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/quote_service_photos/{quoteServicePhotoId}', function ($request, $response, $args) {
    $args = $request->getParsedBody();
    $result = array();
    $enabledIncludes = array(
        'quote_service',
        'attachment'
    );
    $quoteServicePhotos = Models\QuoteServicePhoto::with($enabledIncludes)->find($request->getAttribute('quoteServicePhotoId'));
    if (!empty($quoteServicePhotos)) {
        $validationErrorFields = $quoteServicePhotos->validate($args);
        if (empty($validationErrorFields)) {
            $quoteServicePhotos->fill($args);
            try {
                if ($quoteServicePhotos->save()) {
                    if (!empty($args['image'] && $quoteServicePhotos->id)) {
                        saveImage('QuoteServicePhoto', $args['image'], $quoteServicePhotos->id);
                        quoteTableCountUpdation('QuoteServicePhoto', 'quote_service_photo_count', $quoteServicePhotos->quote_service_id, 0);
                    }
                    if (!empty($args['image_data'] && $quoteServicePhotos->id)) {
                        saveImageData('QuoteServicePhoto', $args['image_data'], $quoteServicePhotos->id);
                        quoteTableCountUpdation('QuoteServicePhoto', 'quote_service_photo_count', $quoteServicePhotos->quote_service_id, 0);
                    }
                    $enabledIncludes = array(
                        'quote_service',
                        'attachment'
                    );
                    $quoteServicePhotos = Models\QuoteServicePhoto::with($enabledIncludes)->find($quoteServicePhotos->id);
                    $result['data'] = $quoteServicePhotos->toArray();
                    return renderWithJson($result);
                } else {
                    return renderWithJson($result, 'You don\'t have permission ', '', 1);
                }
            } catch (Exception $e) {
                return renderWithJson($result, 'Quote Service Photo could not be updated. Please, try again', '', 1);
            }
        } else {
            return renderWithJson($result, 'Quote Service Photo could not be updated. Please, try again', $validationErrorFields, 1);
        }
    } else {
        return renderWithJson($result, 'Quote Service Photo could not be updated. Please, try again.', '', 1);
    }
})->add(new ACL('canUpdateQuoteServicePhoto'));
/**
 * GET QuoteServicePhotoGet
 * Summary: all QuoteServicePhoto
 * Notes: all QuoteServicePhoto
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_services/{quoteServiceId}/quote_service_photos', function ($request, $response, $args) {
    $queryParams = $request->getQueryParams();
    $result = array();
    try {
        $quoteServicePhotos = Models\QuoteServicePhoto::where('quote_service_id', $request->getAttribute('quoteServiceId'))->with('quote_service', 'attachment')->Filter($queryParams)->paginate(PAGE_LIMIT)->toArray();
        $data = $quoteServicePhotos['data'];
        unset($quoteServicePhotos['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $quoteServicePhotos
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * GET QuoteServiceAudio
 * Summary: all QuoteServiceAudio
 * Notes: all QuoteServiceAudio
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_service_audios', function ($request, $response, $args) {
    $queryParams = $request->getQueryParams();
    $count = PAGE_LIMIT;
    if (!empty($queryParams['limit'])) {
        $count = $queryParams['limit'];
    }
    $result = array();
    try {
        $enabledIncludes = array(
            'quote_service'
        );
        $quoteServiceAudios = Models\QuoteServiceAudio::with($enabledIncludes)->Filter($queryParams)->paginate($count)->toArray();
        $data = $quoteServiceAudios['data'];
        unset($quoteServiceAudios['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $quoteServiceAudios
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canListQuoteServiceAudio'));
/**
 * POST QuoteServiceAudio POST
 * Summary:Post QuoteServiceAudio
 * Notes:  Post QuoteServiceAudio
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/quote_service_audios', function ($request, $response, $args) {
    global $authUser;
    $args = $request->getParsedBody();
    $result = array();
    $quoteServiceAudios = new Models\QuoteServiceAudio($args);
    try {
        $validationErrorFields = $quoteServiceAudios->validate($args);
        if ($quoteServiceAudios->save()) {
            quoteTableCountUpdation('QuoteServiceAudio', 'quote_service_audio_count', $quoteServiceAudios->quote_service_id, 0);
            $result['data'] = $quoteServiceAudios->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Your not authorized person', '', 1);
        }
        if (empty($validationErrorFields)) {
            $result['data'] = $quoteServiceAudios->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Quote Servic eAudio could not be added. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Quote Service Audio could not be added. Please, try again.', '', 1);
    }
})->add(new ACL('canCreateQuoteServiceAudio'));
/**
 * GET QuoteServiceAudio QuoteServiceAudioId get
 * Summary: Fetch a QuoteServiceAudio based on QuoteServiceAudio Id
 * Notes: Returns a QuoteServiceAudiofrom the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_service_audios/{quoteServiceAudioId}', function ($request, $response, $args) {
    $result = array();
    try {
        $enabledIncludes = array(
            'quote_service'
        );
        $quoteServiceAudios = Models\QuoteServiceAudio::with($enabledIncludes)->find($request->getAttribute('quoteServiceAudioId'));
        if (!empty($quoteServiceAudios)) {
            $result['data'] = $quoteServiceAudios->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canViewQuoteServiceAudio'));
/**
 * DELETE QuoteServiceAudio QuoteServiceAudioIdDelete
 * Summary: Delete QuoteServiceAudio
 * Notes: Deletes a single QuoteServiceAudio based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/quote_service_audios/{quoteServiceAudioId}', function ($request, $response, $args) {
    $enabledIncludes = array(
        'quote_service'
    );
    $quoteServiceAudios = Models\QuoteServiceAudio::with($enabledIncludes)->find($request->getAttribute('quoteServiceAudioId'));
    $result = array();
    try {
        if (!empty($quoteServiceAudios) && $quoteServiceAudios->delete()) {
            quoteTableCountUpdation('QuoteServiceAudio', 'quote_service_audio_count', $quoteServiceAudios->quote_service_id, 0);
            $result = array(
                'status' => 'success',
            );
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Quote Service Audio could not be deleted. Please, try again.', '', 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Quote Service Audio could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteQuoteServiceAudio'));
/**
 * PUT QuoteServiceAudioQuoteServiceAudioIdPut
 * Summary: Update QuoteServiceAudio details
 * Notes: Update QuoteServiceAudiot details.
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/quote_service_audios/{quoteServiceAudioId}', function ($request, $response, $args) {
    $args = $request->getParsedBody();
    $result = array();
    $enabledIncludes = array(
        'quote_service'
    );
    $quoteServiceAudios = Models\QuoteServiceAudio::with($enabledIncludes)->find($request->getAttribute('quoteServiceAudioId'));
    if (!empty($quoteServiceAudios)) {
        $validationErrorFields = $quoteServiceAudios->validate($args);
        if (empty($validationErrorFields)) {
            $quoteServiceAudios->fill($args);
            try {
                if ($quoteServiceAudios->save()) {
                    quoteTableCountUpdation('QuoteServiceAudio', 'quote_service_audio_count', $quoteServiceAudios->quote_service_id, 0);
                    $result['data'] = $quoteServiceAudios->toArray();
                    return renderWithJson($result);
                } else {
                    return renderWithJson($result, 'Your not authorized person', '', 1);
                }
            } catch (Exception $e) {
                return renderWithJson($result, 'Quote Service Audio could not be updated. Please, try again', '', 1);
            }
        } else {
            return renderWithJson($result, 'Quote Service Audio could not be updated. Please, try again', $validationErrorFields, 1);
        }
    } else {
        return renderWithJson($result, 'Quote Service Audio could not be updated. Please, try again', '', 1);
    }
})->add(new ACL('canUpdateQuoteServiceAudio'));
/**
 * GET QuoteServiceAudioGet
 * Summary: all QuoteServiceAudio lists
 * Notes: all QuoteServiceAudio lists
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_services/{quoteServiceId}/quote_service_audios', function ($request, $response, $args) {
    $queryParams = $request->getQueryParams();
    $result = array();
    try {
        $enabledIncludes = array(
            'quote_service'
        );
        $quoteServiceAudios = Models\QuoteServiceAudio::where('quote_service_id', $request->getAttribute('quoteServiceId'))->with($enabledIncludes)->Filter($queryParams)->paginate(PAGE_LIMIT)->toArray();
        $data = $quoteServiceAudios['data'];
        unset($quoteServiceAudios['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $quoteServiceAudios
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * GET QuoteServiceUserIdQuoteServiceStatsGet
 * Summary: Fetch QuoteService
 * Notes: Returns a QuoteService based on a single ID
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/quote_services/me/service_stats', function ($request, $response, $args) {
    global $authUser;
    $queryParams = $request->getQueryParams();
    $results = array();
    try {
        $userId = $authUser->id;
        $quoteServices['total_service_count'] = Models\QuoteService::where('user_id', $userId)->count();
        $quoteServices['active_service_count'] = Models\QuoteService::where('user_id', $userId)->where('is_active', 1)->count();
        $quoteServices['inactive_service_count'] = Models\QuoteService::where('user_id', $userId)->where('is_active', 0)->count();
        $results = array(
            'data' => $quoteServices
        );
        return renderWithJson($results);
    } catch (Exception $e) {
        return renderWithJson($results, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canQuoteServiceStats'));
$app->GET('/api/v1/quote_requests/me/stats', function ($request, $response, $args) {
    global $authUser;
    $queryParams = $request->getQueryParams();
    $results = array();
    try {
        $userId = $authUser->id;
        $quoteRequest['open_count'] = Models\QuoteRequest::where('user_id', $userId)->where('is_archived', 0)->count();
        $quoteRequest['archived_count'] = Models\QuoteRequest::where('user_id', $userId)->where('is_archived', 1)->count();
        $quoteRequest['all_count'] = Models\QuoteRequest::where('user_id', $userId)->count();
        $results = array(
            'data' => $quoteRequest
        );
        return renderWithJson($results);
    } catch (Exception $e) {
        return renderWithJson($results, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canQuoteRequestStats'));
function _getQuoteBids($request, $response, $args)
{
    global $authUser;
    $queryParams = $request->getQueryParams();
    $count = PAGE_LIMIT;
    if (!empty($queryParams['limit']) && $queryParams['limit'] != 'all') {
        $count = $queryParams['limit'];
    }
    $result = array();
    try {
        $enabledIncludes = array(
            'user',
            'quote_service',
            'quote_status',
            'quote_request',
            'service_provider_user'
        );
        if (!empty($request->getAttribute('requestorId'))) {
            $enabledIncludes = array(
                'user',
                'quote_service',
                'quote_status',
                'quote_request',
                'service_provider_user'
            );
            (isPluginEnabled('Quote/QuoteReview')) ? $enabledIncludes[] = 'reviews' : '';
            $quoteBids = Models\QuoteBid::select('quote_bids.*')->with($enabledIncludes)->where('is_show_bid_to_requestor', 1)->where('quote_bids.user_id', $authUser['id'])->where('quote_status_id', '!=', \Constants\QuoteStatus::NewBid);
            if (isset($queryParams['is_request_for_buy'])) {
                $quoteBids = $quoteBids->Join('quote_requests', 'quote_requests.id', '=', 'quote_bids.quote_request_id')->where('quote_requests.is_request_for_buy', $queryParams['is_request_for_buy']);
            }
            $quoteBids = $quoteBids->Filter($queryParams)->paginate($count)->toArray();
        } elseif (!empty($request->getAttribute('serviceProviderUserId'))) {
            (isPluginEnabled('Quote/QuoteReview')) ? $enabledIncludes[] = 'reviews' : '';
            $quoteBids = Models\QuoteBid::select('quote_bids.*')->with($enabledIncludes)->Filter($queryParams)->where('quote_bids.service_provider_user_id', $authUser['id']);
            if (isset($queryParams['is_request_for_buy'])) {
                $quoteBids = $quoteBids->Join('quote_requests', 'quote_requests.id', '=', 'quote_bids.quote_request_id')->where('quote_requests.is_request_for_buy', $queryParams['is_request_for_buy']);
            }
            if (!empty($queryParams['quote_bid_status_id']) && $queryParams['quote_bid_status_id'] == \Constants\QuoteStatus::NewBid) {
                $quoteBids = $quoteBids->whereHas('quote_request', function ($q) {
                    $q->where('is_archived', 0);
                });
            }
            $quoteBids = $quoteBids->paginate($count);
            $quoteBidsNew = $quoteBids;
            $quoteBids = $quoteBids->map(function ($quoteBid) {
                if (isPluginEnabled('Common/Subscription') && IS_ALLOW_PROVIDER_TO_VIEW_ADDRESS_BEFORE_PAY_CREDIT == 0 && $quoteBid->quote_status_id <= \Constants\QuoteStatus::NewBid) {
                    unset($quoteBid->quote_request['full_address']);
                    unset($quoteBid->quote_request['address']);
                }
                $quoteBidsNew = $quoteBid;
                return $quoteBid;
            });
            $quoteBids = $quoteBidsNew->toArray();
        } else {
            $enabledIncludes = array(
                'user',
                'quote_service',
                'quote_status',
                'quote_request',
                'service_provider_user'
            );
            $quoteBids = Models\QuoteBid::with($enabledIncludes)->Filter($queryParams)->paginate($count)->toArray();
        }
        $data = $quoteBids['data'];
        unset($quoteBids['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $quoteBids
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = $e->getMessage(), $isError = 1);
    }
}
//get Qutote Answer view
function _getQuoteAnswerView($request, $response, $args)
{
    $queryParams = $request->getQueryParams();
    $results = array();
    try {
        $count = PAGE_LIMIT;
        if (!empty($queryParams['limit'])) {
            $count = $queryParams['limit'];
        }
        $enabledIncludes = array(
            'quote_faq_question_template',
            'quote_service',
            'quote_user_faq_question'
        );
        $quoteFaqAnswers = Models\QuoteFaqAnswer::with($enabledIncludes)->Filter($queryParams)->paginate($count)->toArray();
        if (!empty($args['quoteFaqAnswerId'])) {
            $quoteFaqAnswers['data'] = Models\QuoteFaqAnswer::with($enabledIncludes)->Filter($queryParams)->find($args['quoteFaqAnswerId']);
        }
        if (!empty($args['quoteServiceId'])) {
            $quoteFaqAnswers['data'] = Models\QuoteFaqAnswer::with($enabledIncludes)->Filter($queryParams)->where('quote_service_id', $args['quoteServiceId'])->get()->toArray();
        }
        $data = $quoteFaqAnswers['data'];
        unset($quoteFaqAnswers['data']);
        $results = array(
            'data' => $data,
            '_metadata' => $quoteFaqAnswers
        );
        return renderWithJson($results);
    } catch (Exception $e) {
        return renderWithJson($results, $message = 'No record found', $fields = '', $isError = 1);
    }
}
//get Qutote Service
function _getQuoteService($request, $response, $args)
{
    global $authUser;
    $queryParams = $request->getQueryParams();
    $results = array();
    try {
        $count = PAGE_LIMIT;
        if (!empty($queryParams['limit'])) {
            $count = $queryParams['limit'];
        }
        $enabledIncludes = array(
            'attachment',
            'user',
            'city',
            'state',
            'country'
        );
        $quoteServices = Models\QuoteService::with($enabledIncludes);
        if (!empty($queryParams['filter'])) {
            if ($queryParams['filter'] == 'all') {
                $quoteServices = $quoteServices->Filter($queryParams);
            }
        } else {
            $quoteServices = $quoteServices->where('is_active', 1);
            if (empty($queryParams['is_admin_suspend'])) {
                $quoteServices = $quoteServices->where('is_admin_suspend', 0);
            }
        }
        if (!empty($queryParams['latitude']) && !empty($queryParams['longitude'])) {
            $lat = $latitude = $queryParams['latitude'];
            $lng = $longitude = $queryParams['longitude'];
            $radius = isset($queryParams['radius']) ? $queryParams['radius'] : 5;
            $distance = 'ROUND(( 6371 * acos( cos( radians(' . $latitude . ') ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(' . $longitude . ')) + sin( radians(' . $latitude . ') ) * sin( radians( latitude ) ) )))';
            $quoteServices = $quoteServices->select('quote_services.*')->selectRaw($distance . ' AS distance')->whereRaw('(' . $distance . ')<=' . $radius)->orderBy("distance");
        }
        if (!empty($args['quoteServiceId'])) {
            $enabledIncludes = array(
                'attachment',
                'user',
                'city',
                'state',
                'country',
                'quote_categories_quote_services'
            );
            $quote_service_details = Models\QuoteService::with($enabledIncludes)->Filter($queryParams)->find($args['quoteServiceId']);
            if (empty($quote_service_details)) {
                return renderWithJson($results, $message = 'No record found', $fields = '', $isError = 1, 404);
            } else {
                $quote_service_details['data'] = $quote_service_details->toArray();
                if ((($quote_service_details['data']['is_active'] == 0 || $quote_service_details['data']['is_admin_suspend'] == 1)) && ($authUser->id != $quote_service_details['data']['user_id'] && $authUser->role_id != \Constants\ConstUserTypes::Admin)) {
                    return renderWithJson($results, $message = 'No record found', $fields = '', $isError = 1, 404);
                }
                if (!empty($_GET['type']) && $_GET['type'] == 'view') {
                    insertViews($request->getAttribute('quoteServiceId'), 'QuoteService');
                }
                $quoteServices = $quote_service_details;
            }
        }
        if (!empty($args['userId'])) {
            $quoteServices = $quoteServices->where('user_id', $args['userId']);
        }
        if (!empty($args['quoteCategoryId'])) {
            $quoteCategories = Models\QuoteCategoryQuoteService::where('quote_category_id', $args['quoteCategoryId'])->select('quote_service_id')->get();
            $quoteServices = $quoteServices->whereIn('id', $quoteCategory);
        }
        if (!empty($args['quoteServiceId'])) {
            $data = $quoteServices['data'];
            $results = array(
                'data' => $data
            );
        } else {
            $quoteServices = $quoteServices->Filter($queryParams)->paginate($count)->toArray();
            $data = $quoteServices['data'];
            unset($quoteServices['data']);
            $results = array(
                'data' => $data,
                '_metadata' => $quoteServices
            );
        }
        return renderWithJson($results);
    } catch (Exception $e) {
        return renderWithJson($results, $message = 'No record found', $fields = '', $isError = 1, 404);
    }
}
