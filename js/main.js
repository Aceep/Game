import {display_welcome_page, display_login_page, display_logincheck_page, display_register_page, display_profile_page, display_match_history, display_friend_list, display_game_page, display_404, display_403, display_duel_login_page, display_tournament_login_page, display_tournament_order_page} from "./modules/display.js";
import {fill_profile_page, fill_match_history, fill_friend_list, fill_logged_duel_users, fill_logged_tournament_users, fill_game_users , fill_tournament_order_players} from "./modules/fill.js";
import {getCookie, get_csrf_token, FetchWithToken, convertFileToBase64, sendFileToBackend} from "./modules/utility.js";
import {lang_en, lang_fr} from "./modules/lang.js";

import * as GAME from "../game/src/game.js";
import * as TITLE from "../game/src/title.js";

var page_status = "welcome_page";               // Used to keep track of our current status
var state = {saved_status:page_status};         // An object containing a status, used with history API
var lang = lang_en;
var pref_lang = null;

// Detect when the user clicks on an element
//  - If the id of the clicked element corresponds to a change of page:
//          1. Save the current page in history
//          2. Change the page_status to the new state
//          3. Also save that new state
//          4. Call the main function that will act based on page_status
//  - If the id corresponds to a submit element, act based on input received
//    then, if needed, redirect to the correct page using the above steps
document.addEventListener("click", async function(event) {


    const element = event.target;
    switch (element.id) {

        case "lang_en":
            lang = lang_en;
            main();
            break;

        case "lang_fr":
            lang = lang_fr;
            main();
            break;

        case "pref_lang_en":
            pref_lang = "en";
            break;

        case "pref_lang_fr":
            pref_lang = "fr";
            break;

        case "pref_lang_es":
            pref_lang = "es";
            break;

        case "login":
            event.preventDefault();
            state.saved_status = page_status;
            page_status = "login_page";
            state.saved_status = page_status;
            history.pushState(state, "login", "?page=login");
            main();
            break;

        case "register":
            event.preventDefault();
            state.saved_status = page_status;
            page_status = "register_page";
            state.saved_status = page_status;
            history.pushState(state, "register", "?page=register");
            main();
            break;

        case "invitee":
            event.preventDefault();
            state.saved_status = page_status;
            page_status = "game_page";
            state.saved_status = page_status;
            history.pushState(state, "game", "?page=game");
            main();
            break;

        case "tournament_image":
            event.preventDefault();
            state.saved_status = page_status;
            page_status = "tournamentLogin_page";
            state.saved_status = page_status;
            history.pushState(state, "tournamentLogin", "?page=tournamentLogin");
            main();
            break;

        case "duel_image":
            event.preventDefault();
            state.saved_status = page_status;
            page_status = "duelLogin_page";
            state.saved_status = page_status;
            history.pushState(state, "duelLogin", "?page=duelLogin");
            main();
            break;

        case "login_submit":
            event.preventDefault();
            await check_login_input(lang);
            break;

        case "two_fa_submit":
            event.preventDefault();
            await check_two_fa_input(lang);
            break;

        case "send_code":
            event.preventDefault();
            await send_two_fa_code(lang);
            break;

        case "register_submit":
            event.preventDefault();
            await check_register_input(lang);
            break;

        case "proceed_submit":
            event.preventDefault();
            state.saved_status = page_status;
            page_status = "loginCheck_page";
            state.saved_status = page_status;
            history.pushState(state, "loginCheck", "?page=loginCheck");
            main();
            break;

        case "edit_submit":
            event.preventDefault();
            await check_edit_input(lang);
            main();
            break;

        case "add_friend_submit":
            event.preventDefault();
            await confirm_friend_add(lang);
            break;

        case "delete_friend_1":
        case "delete_friend_2":
        case "delete_friend_3":
        case "delete_friend_4":
        case "delete_friend_5":
        case "delete_friend_6":
        case "delete_friend_7":
        case "delete_friend_8":
        case "delete_friend_9":
        case "delete_friend_10":
            await confirm_friend_delete(element.id);
            break;

        case "confirm_logout":
            await confirm_user_logout(lang);
            break;

        case "confirm_delete":
            await confirm_user_delete(lang);
            break;

        case "right_panel_button_toggle":
            event.preventDefault();
            handle_right_panel_switch(lang);
            break;

        case "profile_avatar":
            handle_avatar_change(lang);
            break;

        case "user_2_submit":
        case "user_3_submit":
        case "user_4_submit":
            event.preventDefault();
            if (await tournament_guest_login(element.id, lang) === 1) {
                fill_logged_tournament_users(lang);
            }
            break;

        case "duel_guest_submit":
            event.preventDefault();
            if (await duel_guest_login(lang) === 1) {
                fill_logged_duel_users(lang);
            }
            break;

        case "tournament_start":
            state.saved_status = page_status;
            page_status = "tournamentOrder_page";
            state.saved_status = page_status;
            history.pushState(state, "tournamentOrder", "?page=tournamentOrder");
            main();
            break;

        case "duel_start":
            state.saved_status = page_status;
            page_status = "game_page";
            state.saved_status = page_status;
            history.pushState(state, "game", "?page=game");
            main();
            break;

        case "home_button":
            event.preventDefault();
            state.saved_status = page_status;
            page_status = "welcome_page";
            state.saved_status = page_status;
            history.pushState(state, "welcome", "?page=welcome");
            main();
            break;

        case "next_match_input":
            break;

        default:
            break;
    }
});

// The other way to change "pages" is to use back/forward buttons, which are caught here
// Update our page status based on what the state saved earlier then call main()
window.addEventListener('popstate', function(event) {

    var state = event.state;

    if (state) {
        page_status = state.saved_status;
        main();
    }
});

// Initial call to main
main();

// The main function will call the right display function based on page_status
//! It will attempt to read from the url so it's mandatory to properly use history.pushState()
async function main() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let value = 0;

    page_status = urlParams.get('page') + '_page';

    if (page_status === "null_page") {
        page_status = "welcome_page";
    }

    switch (page_status) {

        case "welcome_page":
            display_welcome_page(lang);
            break;

        case "login_page":
            value = await user_auth_check();
            if (value === 0) {
                display_login_page(lang);
            }
            else {
                state.saved_status = page_status;
                history.pushState(state, "login", "?page=login");
                page_status = "profile_page";
                state.saved_status = page_status;
                history.pushState(state, "profile", "?page=profile");
                main();
            }
            break;

        case "register_page":
            value = await user_auth_check();
            if (value === 0) {
                display_register_page(lang);
            }
            else {
                state.saved_status = page_status;
                history.pushState(state, "register", "?page=register");
                page_status = "profile_page";
                state.saved_status = page_status;
                history.pushState(state, "profile", "?page=profile");
                main();
            }
            break;

        case "profile_page":
            value = await user_auth_check();
            if (value === 0) {
                display_403(lang);
            }
            else {
                lang = await get_preferred_lang();
                display_profile_page(lang);
                display_match_history(lang);
                fill_profile_page(lang);
                fill_match_history(lang);
            }
            break;

        case "game_page":
            value = await user_auth_check();
            // if (value === 0) {
            //     display_403(lang);
            // }
            // else {
                lang = await get_preferred_lang();
                display_game_page(lang);
                fill_game_users(lang);
            //}
            break;

        case "duelLogin_page":
            value = await user_auth_check();
            if (value === 0) {
                display_403(lang);
            }
            else {
                lang = await get_preferred_lang();
                display_duel_login_page(lang);
                fill_logged_duel_users(lang);
            }
            break;

        case "tournamentLogin_page":
            value = await user_auth_check();
            if (value === 0) {
                display_403(lang);
            }
            else {
                lang = await get_preferred_lang();
                display_tournament_login_page(lang);
                fill_logged_tournament_users(lang);
            }
            break;

        case "tournamentOrder_page":
            value = await user_auth_check();
            if (value === 0) {
                display_403(lang);
            }
            else {
                lang = await get_preferred_lang();
                display_tournament_order_page(lang);
                fill_tournament_order_players(lang);
            }
            break;

        case "loginCheck_page":
            display_logincheck_page(lang);
            break ;

        default :
            display_404(lang);
    }

    history.replaceState(state, null, '?page=' + page_status.split('_')[0]);
}

// We'll send a request to the back with the form input (username + password)
// The back will check that the user is known and the password is correct, if so, move to the profile page
async function check_login_input(lang) {

    const   infoField = document.getElementById("info");
    const   formElement = document.getElementById("form_element");

    if (formElement.checkValidity() === false) {
        formElement.reportValidity();
        return;
    }

    var username = document.getElementById("login_username_input").value;
    var password = document.getElementById("login_password_input").value;


    await get_csrf_token();
    var csrftoken = getCookie('csrftoken');

    const jsonData = {
        username: username,
        password: password
    };

    var headers = new Headers()
    headers.append("Content-Type", "application/json");
    headers.append('X-CSRFToken', csrftoken);

    try {
        const response = await fetch("https://localhost:4241/authent/login", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(jsonData),
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            infoField.textContent=`${lang.credentials_error}`;
            return;
        }
        else {
            state.saved_status = page_status;
            history.pushState(state, "login", "?page=login");
            page_status = "loginCheck_page";
            state.saved_status = page_status;
            history.pushState(state, "loginCheck", "?page=loginCheck");
            main();
        }

    }
    catch (error) {
        infoField.textContent=`${lang.server_error}`;
        console.error("Fetch request failed:", error);
    }
}

async function check_two_fa_input(lang) {

    const   infoField = document.getElementById("info");
    const   formElement = document.getElementById("form_element");

    if (formElement.checkValidity() === false) {
        formElement.reportValidity();
        return;
    }

    var code = document.getElementById("two_fa_input").value;

    await get_csrf_token();
    var csrftoken = getCookie('csrftoken');

    const jsonData = {
        code: code
    };

    var headers = new Headers()
    headers.append("Content-Type", "application/json");
    headers.append('X-CSRFToken', csrftoken);

    try {
        const response = await fetch("https://localhost:4241/authent/get_jwt", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(jsonData),
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            infoField.textContent=`${lang.two_fa_error}`;
            return;
        }
        else {

            var token = await response.json();

            localStorage.setItem("access_token", token.access);
            localStorage.setItem("refresh_token", token.refresh);

            state.saved_status = page_status;
            history.pushState(state, "loginCheck", "?page=loginCheck");
            page_status = "profile_page";
            state.saved_status = page_status;
            history.pushState(state, "profile", "?page=profile");
            main();
        }

    }
    catch (error) {
        infoField.textContent=`${lang.server_error}`;
        console.error("Fetch request failed:", error);
    }
}

async function send_two_fa_code(lang) {
    const   infoField = document.getElementById("info");

    await get_csrf_token();
    var csrftoken = getCookie('csrftoken');

    var headers = new Headers()
    headers.append("Content-Type", "application/json");
    headers.append('X-CSRFToken', csrftoken);

    try {
        const response = await fetch("https://localhost:4241/authent/sendcode", {
            method: "POST",
            headers: headers,
            credentials: 'include',
            mode: 'cors'
        });

        if (response.status === 400) {
            infoField.textContent=`${lang.code_useless}`;
            return;
        }
        else if (!response.ok) {
            infoField.textContent=`${lang.server_error}`;
            return;
        }
        infoField.textContent=`${lang.code_sent}`;
    }
    catch (error) {
        infoField.textContent=`${lang.server_error}`;
        console.error("Fetch request failed:", error);
    }


}

// We'll send a request to the back with the form input (username + password + password_confirm)
// The back will check that the two password match, if so, move to the profile page
async function check_register_input(lang) {

    const   infoField = document.getElementById("info");
    const   formElement = document.getElementById("form_element");

    if (formElement.checkValidity() === false) {
        formElement.reportValidity();
        return;
    }

    var username = document.getElementById("register_username_input").value;
    var password = document.getElementById("register_password_input").value;
    var password_confirm = document.getElementById("register_password_input_confirm").value;
    var email = document.getElementById("register_email_input").value;
    var phone = document.getElementById("register_phone_input").value;
    var twofa = document.getElementById("register_twofa_input").value;

    console.log(twofa);

    if (password !== password_confirm) {
        infoField.innerHTML = `${lang.passwords_error}`;
        return ;
    }

    if (twofa === "none") {
        infoField.innerHTML = `${lang.two_fa_no_choice_error}`;
        return ;
    }

    await get_csrf_token();
    var csrftoken = getCookie('csrftoken');

    const jsonData = {
        username: username,
        password: password,
        email: email,
        phone: phone,
        mfa_method: twofa
    };

    var headers = new Headers()
    headers.append("Content-Type", "application/json");
    headers.append('X-CSRFToken', csrftoken);

    try {
        const response = await fetch("https://localhost:4241/authent/register", {
            method: "POST",
            body: JSON.stringify(jsonData),
            headers: headers,
            credentials: 'include'
        });

        if (!response.ok) {
            infoField.textContent=`${lang.username_error}`;
            return;
        }

        if (twofa === "two_fa_app") {
            formElement.innerHTML = `
            <p>${lang.qr_code_prompt}</p>
            <img src="" alt="Qr Code" id="qr_code" draggable="false">
            <div id="info"></div>
            <button class="w-100 btn btn-lg btn-primary btn-block py-2 my-1" type="submit" id="proceed_submit">${lang.proceed}</button>
            `

            var qr_code = document.getElementById("qr_code");

            headers.delete("Content-Type", "application/json");

            const qr_response = await fetch("https://localhost:4241/authent/send_mfa_qrcode", {
                method: "POST",
                headers: headers,
                credentials: 'include'
            });

            if (!qr_response.ok) {
                infoField.textContent=`${lang.qr_missing}`;
                return;
            }

            const qr_data = await qr_response.json();

            qr_code.src = `data:image/png;base64,${qr_data.qr_code}`;
        }
        else {
            state.saved_status = page_status;
            history.pushState(state, "register", "?page=register");
            page_status = "loginCheck_page";
            state.saved_status = page_status;
            history.pushState(state, "loginCheck", "?page=loginCheck");
            main();
        }
    }
    catch(error) {
        infoField.textContent=`${lang.server_error}`;
        console.error("Fetch request failed:", error);
    }
}

// We'll send a request to the back with the form input (username + password + password_confirm)
// The back will check that the two password match, if so, move to the profile page
async function check_edit_input(lang) {

    const   infoField = document.getElementById("info_edit");
    const   formElement = document.getElementById("form_element_edit");

    if (formElement.checkValidity() === false) {
        formElement.reportValidity();
        return;
    }

    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;
    const password_confirm = document.getElementById("newPasswordConfirm").value;

    if ((!username && !password) || (!username && !password_confirm)) {
        return ;
    }

    if (password && (password !== password_confirm)) {
        infoField.innerHTML = `${lang.passwords_error}`;
    }

    await get_csrf_token();
    var csrftoken = getCookie('csrftoken');

    const jsonData = {
        new_username: username,
        new_password: password,
        new_password_confirm: password_confirm,
        pref_lang: pref_lang
    };


    var headers = new Headers();
    headers.append('X-CSRFToken', csrftoken);
    headers.append('Content-Type', 'application/json');

    try {
        const response = await FetchWithToken("https://localhost:4241/authent/edit", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(jsonData),
            credentials: 'include'
        });

        if (!response.ok) {
            infoField.textContent=`${lang.username_error}`;
            return;
        }
        main();
    }
    catch(error) {
        infoField.textContent=`${lang.server_error}`;
        console.error("Fetch request failed:", error);
    }
}

async function confirm_friend_add(lang) {

    const   infoField = document.getElementById("info_friend");
    const   formElement = document.getElementById("form_element_friend");
    const   modal = document.getElementById("friendAdd");

    if (formElement.checkValidity() === false) {
        formElement.reportValidity();
        return;
    }

    const username = document.getElementById("friendUsername").value;

    await get_csrf_token();
    var csrftoken = getCookie('csrftoken');

    const jsonData = {
        friend_username: username
    };

    var headers = new Headers();
    headers.append('X-CSRFToken', csrftoken);
    headers.append("Content-Type", "application/json");

    try {
        const response = await FetchWithToken("https://localhost:4241/user/add_friend", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(jsonData),
            credentials: 'include'
        });

        if (!response.ok) {
            infoField.textContent=`${lang.friend_error}`;
            return;
        }
        modal.hide();
        main();
    }
    catch(error) {
        infoField.textContent=`${lang.server_error}`;
        console.error("Fetch request failed:", error);
    }
}

async function confirm_friend_delete(element_id) {

    const friend_number = element_id.slice(-1);

    const friend_id = "friend_" + friend_number;
    const friend_username = document.getElementById(friend_id).getElementsByTagName('td')[0].innerHTML;

    await get_csrf_token();
    var csrftoken = getCookie('csrftoken');

    var headers = new Headers()
    headers.append("Content-Type", "application/json");
    headers.append('X-CSRFToken', csrftoken);

    const jsonData = {
        friend_username: friend_username
    };

    try {
        const response = await FetchWithToken("https://localhost:4241/user/delete_friend", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(jsonData),
            credentials: 'include'
        });

        if (!response.ok) {
            return;
        }
        main();
    }
    catch(error) {
        console.error("Fetch request failed:", error);
    }
}

// Warn the server that we want to log out, if it's okay go back to welcome page
async function confirm_user_logout() {

    await get_csrf_token();
    var csrftoken = getCookie('csrftoken');

    var headers = new Headers()
    headers.append("Content-Type", "application/json");
    headers.append('X-CSRFToken', csrftoken);
    try {
        let refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken)
        {
            console.error("Failed to get refresh token, user should already be logged out.");
            return;
        }
        const response = await FetchWithToken("https://localhost:4241/authent/logout", {
            method: "POST",
            body: JSON.stringify({"refresh": refreshToken}),
            headers: headers,
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            console.error("Logout request failed.");
            return;
        }

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        state.saved_status = page_status;
        history.pushState(state, "profile", "?page=profile");
        page_status = "welcome_page";
        state.saved_status = page_status;
        history.pushState(state, "welcome", "?page=welcome");
        main();
    }
    catch(error) {
        console.error("Logout request failed:", error);
        return;
    }
}

// Warn the server that we want to delete, if it's okay go back to welcome page
async function confirm_user_delete() {

    await get_csrf_token();
    var csrftoken = getCookie('csrftoken');

    var headers = new Headers()
    headers.append("Content-Type", "application/json");
    headers.append('X-CSRFToken', csrftoken);
    try {
        let refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken)
        {
            console.error("User is logged out.");
            return;
        }
        const response = await FetchWithToken("https://localhost:4241/authent/delete", {
            method: "POST",
            body: JSON.stringify({"refresh": refreshToken}),
            headers: headers,
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            console.error("Delete request failed.");
            return;
        }

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        state.saved_status = page_status;
        history.pushState(state, "profile", "?page=profile");
        page_status = "welcome_page";
        state.saved_status = page_status;
        history.pushState(state, "welcome", "?page=welcome");
        main();
    }
    catch(error) {
        console.error("Delete request failed:", error);
        return;
    }
}

// Change the right panel from Match history to Friend list and vice versa
function handle_right_panel_switch(lang) {

    const   friend_table = document.getElementById("friend_list");
    const   switch_button = document.getElementById("right_panel_button_toggle");

    if (friend_table === null) {
        switch_button.innerHTML = `${lang.match_history}`;
        display_friend_list(lang);
        fill_friend_list(lang);
    }
    else {
        switch_button.innerHTML =`${lang.friend_list_title}`;
        display_match_history(lang);
        fill_match_history(lang);
    }
}

function handle_avatar_change(lang) {

    const avatar_input = document.getElementById("avatar_input");

    avatar_input.click();

    avatar_input.addEventListener('change', function() {
        const file = this.files[0]; // Get the selected file

        if (file) {
            // Check if the file size is within the limit
            const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSizeInBytes) {
                alert(`${lang.file_size_error}`);
                return;
            }

            convertFileToBase64(file)
            .then(base64String => {
                sendFileToBackend(base64String);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });
}

// If a user successfuly logs in for a duel, replace their card with a template for an avatar and a username
// fill_logged_duel_users() MUST be called after IF we didn't return null, it will fill the template with fetch requests
// If we return null we MUST NOT call it as it will prevent the error message from showing by refreshing the page
async function duel_guest_login(lang) {
    var card = document.getElementById("duel_guest");
    var username = document.getElementById("duel_guest_username").value;
    var password = document.getElementById("duel_guest_password").value;
    var infoField = document.getElementById("info_duel_guest");
    var formElement = document.getElementById("form_duel_guest_login");

    if (formElement.checkValidity() === false) {
        formElement.reportValidity();
        return (0);
    }

    await get_csrf_token();
    var csrftoken = getCookie('csrftoken');

    const jsonData = {
        username: username,
        password: password
    };

    var headers = new Headers()
    headers.append('Content-Type', 'application/json');
    headers.append('X-CSRFToken', csrftoken);

    try {

        const response = await FetchWithToken("https://localhost:4241/authent/duel_guest_login", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(jsonData),
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            infoField.textContent=`${lang.credentials_error}`;
            return (0);
        }

        // HTML replacement
        card.innerHTML = `
                <div class="row text-center">
                    <img src="" alt="Avatar" id="duel_guest_avatar" class="user_avatar" draggable="false">
                    <h4 class="my-3" id="duel_guest_username"></h4>
                    <p class="mt-4 mb-2 text-muted text-end">${lang.guest}</p>
                </div>
            `;
    }
    catch (error) {
        infoField.textContent=`${lang.server_error}`;
        console.error("Fetch request failed:", error);
        return (0);
    }

    return (1);
}

// If a user successfuly logs in for a tournament, replace their card with a template for an avatar and a username
// fill_logged_tournament_users() MUST be called after IF we didn't return null, it will fill the template with fetch requests
// If we return null we MUST NOT call it as it will prevent the error message from showing by refreshing the page
async function tournament_guest_login(button_id, lang) {

    if (button_id === "user_2_submit") {
        var card = document.getElementById("tournament_user_2");
        var guest_num = 2;
        var username = document.getElementById("user_2_username").value;
        var password = document.getElementById("user_2_password").value;
        var infoField = document.getElementById("info_user2");
        var formElement = document.getElementById("form_user_2_login");
    }
    else if (button_id === "user_3_submit") {
        var card = document.getElementById("tournament_user_3");
        var guest_num = 3;
        var username = document.getElementById("user_3_username").value;
        var password = document.getElementById("user_3_password").value;
        var infoField = document.getElementById("info_user3");
        var formElement = document.getElementById("form_user_3_login");
    }
    else if (button_id === "user_4_submit"){
        var card = document.getElementById("tournament_user_4");
        var guest_num = 4;
        var username = document.getElementById("user_4_username").value;
        var password = document.getElementById("user_4_password").value;
        var infoField = document.getElementById("info_user4");
        var formElement = document.getElementById("form_user_4_login");
    }

    if (formElement.checkValidity() === false) {
        formElement.reportValidity();
        return (0);
    }

    await get_csrf_token();
    var csrftoken = getCookie('csrftoken');

    const jsonData = {
        username: username,
        password: password
    };

    var headers = new Headers()
    headers.append("Content-Type", "application/json");
    headers.append('X-CSRFToken', csrftoken);
    headers.append('Guest-Num', guest_num);

    try {
        const response = await FetchWithToken("https://localhost:4241/authent/tournament_guest_login", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(jsonData),
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            infoField.textContent="Invalid username or password. Please try again";
            return (0);
        }

        // HTML replacement

        if (button_id === "user_2_submit") {
            card.innerHTML = `
                <div class="row text-center">
                    <img src="" alt="Avatar" id="tournament_user_2_avatar" class="user_avatar" draggable="false">
                    <h4 class="my-3" id="tournament_user_2_username"></h4>
                    <p class="mt-4 mb-2 text-muted text-end">${lang.guest} 1</p>
                </div>
            `
        }
        else if (button_id === "user_3_submit") {
            card.innerHTML = `
                <div class="row text-center">
                    <img src="" alt="Avatar" id="tournament_user_3_avatar" class="user_avatar" draggable="false">
                    <h4 class="my-3" id="tournament_user_3_username"></h4>
                    <p class="mt-4 mb-2 text-muted text-end">${lang.guest} 2</p>
                </div>
            `
        }
        else if (button_id === "user_4_submit") {
            card.innerHTML = `
                <div class="row text-center">
                    <img src="" alt="Avatar" id="tournament_user_4_avatar" class="user_avatar" draggable="false">
                    <h4 class="my-3" id="tournament_user_4_username"></h4>
                    <p class="mt-4 mb-2 text-muted text-end">${lang.guest} 3</p>
                </div>
            `
        }
    }
    catch (error) {
        infoField.textContent="Server might be down. Please try again later";
        console.error("Fetch request failed:", error);
        return (0);
    }

    return (1);
}

async function user_auth_check() {

    try {

        const response = await FetchWithToken("https://localhost:4241/user/authCheck", {
            method: "GET",
            credentials: 'include',
            mode: 'cors'
        });


        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
    }
    catch (error) {
        console.error(`ERROR: ${error}`);
        return (0);
    }

    return (1);
}

async function fetch_preferred_lang() {

    try {

        var headers = new Headers();

        const response = await FetchWithToken("https://localhost:4241/user/lang", {
            method: "GET",
            headers: headers,
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        return (data.pref_lang);
    }
    catch (error) {
        console.error(`ERROR: ${error}`);
    }
    return (null);
}

async function get_preferred_lang() {

    var value = await fetch_preferred_lang();

    if (!value || value === "en") {
        return (lang_en);
    }
    else if (value === "fr") {
        return (lang_fr);
    }
    else if (value === "es") {
        return (lang_es);
    }
    return (lang_en);
}
