// Contains HTML injection code ONLY
// There MUST NOT be any application logic here

const body = document.querySelector("body");

export function display_welcome_page(lang) {

    body.innerHTML = `
        <script src="./bootstrap/js/bootstrap.bundle.js" defer></script>
        <script src="./js/main.js" defer></script>
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                Language
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li><a class="dropdown-item" role="button" id="lang_fr">Francais</a></li>
                <li><a class="dropdown-item" role="button" id="lang_en">English</a></li>
                <li><a class="dropdown-item" role="button" id="lang_es">Español</a></li>
            </ul>
        </div>
        <main class="form-signin w-100 m-auto">
            <img class="mb-4" src="https://42.fr/wp-content/uploads/2021/07/42-Final-sigle-seul.svg" alt="42 logo" width="72" height="72">
            <h1 class="h3 mb-3 fw-normal">${lang.welcome}</h1>
            <button class="w-100 btn btn-lg btn-primary btn-block py-2 my-1 disabled" id="login">${lang.login}</button>
            <button class="w-100 btn btn-lg btn-primary btn-block py-2 my-1 disabled" id="register">${lang.register}</button>
            <button class="w-100 btn btn-lg btn-primary btn-block py-2 my-1" id="invitee">Play as invitee</button>
            <p class="mt-4 mb-3 text-muted">2024 - ft_transcendence</p>
        </main>`;
}

export function display_login_page(lang) {
    body.innerHTML = `
        <script src="./bootstrap/js/bootstrap.bundle.js" defer></script>
        <script src="./js/main.js" defer></script>
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                Language
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li><a class="dropdown-item" role="button" id="lang_fr">Francais</a></li>
                <li><a class="dropdown-item" role="button" id="lang_en">English</a></li>
                <li><a class="dropdown-item" role="button" id="lang_es">Español</a></li>
            </ul>
        </div>
        <main class="form-signin w-100 m-auto">
            <img class="mb-4" src="https://42.fr/wp-content/uploads/2021/07/42-Final-sigle-seul.svg" alt="42 logo" width="72" height="72">
            <h1 class="h3 mb-3 fw-normal">${lang.login}</h1>
            <form class="form-floating" id="form_element">
                <div class="form-floating">
                    <input id="login_username_input" class="form-control" type="text" maxlength="12" required>
                    <label for="login_username_input">${lang.username}</label>
                </div>
                <div class="form-floating">
                    <input id="login_password_input" class="form-control" maxlength="32" type="password" pattern="[a-zA-Z0-9]{6,}" title="Must contain at least 6 alphanumeric characters" required>
                    <label for="login_password_input">${lang.password}</label>
                </div>
                <div id="info"></div>
                <button class="w-100 btn btn-lg btn-primary btn-block py-2 my-1" type ="submit" id="login_submit">${lang.login}</button>
            </form>
            <p class="mt-4 mb-3 text-muted">2024 - ft_transcendence</p>
        </main>`;
}

export function display_logincheck_page(lang) {
    body.innerHTML = `
        <script src="./bootstrap/js/bootstrap.bundle.js" defer></script>
        <script src="./js/main.js" defer></script>
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                Language
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li><a class="dropdown-item" role="button" id="lang_fr">Francais</a></li>
                <li><a class="dropdown-item" role="button" id="lang_en">English</a></li>
                <li><a class="dropdown-item" role="button" id="lang_es">Español</a></li>
            </ul>
        </div>
        <main class="form-signin w-100 m-auto">
            <img class="mb-4" src="https://42.fr/wp-content/uploads/2021/07/42-Final-sigle-seul.svg" alt="42 logo" width="72" height="72">
            <h1 class="h3 mb-3 fw-normal">${lang.two_fa_prompt}</h1>
            <button type="button" class="btn btn-info my-1 w-100" id="send_code">${lang.send_code}</button>
            <form class="form-floating" id="form_element">
                <div class="form-floating">
                    <input id="two_fa_input" class="form-control" type="text" maxlength="6" pattern="[0-9]{6}" required>
                    <label for="two_fa_input">${lang.two_fa}</label>
                </div>
                <div id="info"></div>
                <button class="w-100 btn btn-lg btn-primary btn-block py-2 my-1" type ="submit" id="two_fa_submit">${lang.confirm}</button>
            </form>
            <p class="mt-4 mb-3 text-muted">2024 - ft_transcendence</p>
        </main>`;
}

export function display_register_page(lang) {
    body.innerHTML = `
        <script src="./bootstrap/js/bootstrap.bundle.js" defer></script>
        <script src="./js/main.js" defer></script>
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                Language
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li><a class="dropdown-item" role="button" id="lang_fr">Francais</a></li>
                <li><a class="dropdown-item" role="button" id="lang_en">English</a></li>
                <li><a class="dropdown-item" role="button" id="lang_es">Español</a></li>
            </ul>
        </div>
        <main class="form-signin w-100 m-auto">
            <img class="mb-4" src="https://42.fr/wp-content/uploads/2021/07/42-Final-sigle-seul.svg" alt="42 logo" width="72" height="72">
            <h1 class="h3 mb-3 fw-normal">${lang.register}</h1>
            <form class="form-floating" id="form_element">
                <div class="form-floating">
                    <input id="register_username_input" class="form-control" maxlength="12" type="text" required>
                    <label for="register_username_input">${lang.username}</label>
                </div>
                <div class="form-floating">
                    <input id="register_password_input" class="form-control" maxlength="32" type="password" pattern="[a-zA-Z0-9]{6,}" title="${lang.password_format}" required>
                    <label for="register_password_input">${lang.password}</label>
                </div>
                <div class="form-floating">
                    <input id="register_password_input_confirm" class="form-control" maxlength="32" type="password" pattern="[a-zA-Z0-9]{6,}" title="${lang.password_format}" required>
                    <label for="register_password_input_confirm">${lang.password_confirm}</label>
                </div>
                <div class="form-floating">
                    <input id="register_email_input" class="form-control" maxlength="32" type="email" required>
                    <label for="register_email_input">${lang.email}</label>
                </div>
                <div class="form-floating">
                    <input id="register_phone_input" class="form-control" type="text" name="Phone Number" pattern="[0]{1}[0-9]{9}" title="${lang.phone_format}" required>
                    <label for="register_phone_input">${lang.phone}</label>
                </div>
                <select class="form-select" aria-label="2fa method" id="register_twofa_input" required>
                    <option selected value="none">${lang.two_fa_choice}</option>
                    <option value="two_fa_sms">SMS</option>
                    <option value="two_fa_mail">Mail</option>
                    <option value="two_fa_app">App</option>
                </select>
                <div id="info"></div>
                <button class="w-100 btn btn-lg btn-primary btn-block py-2 my-1" type="submit" id="register_submit">${lang.register}</button>
            </form>
            <p class="mt-4 mb-3 text-muted">2024 - ft_transcendence</p>
        </main>`;
}

export function display_profile_page(lang) {
    body.innerHTML = `
    <script src="./bootstrap/js/bootstrap.bundle.js" defer></script>
    <script src="./js/main.js" defer></script>
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            Language
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><a class="dropdown-item" role="button" id="lang_fr">Francais</a></li>
            <li><a class="dropdown-item" role="button" id="lang_en">English</a></li>
            <li><a class="dropdown-item" role="button" id="lang_es">Español</a></li>
        </ul>
    </div>
    <div class="modal fade modal-sheet" role="dialog" id="logoutConfirm" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content rounded-3 shadow">
          <div class="modal-body p-4 text-center">
            <h5 class="mb-0">${lang.logout_prompt}</h5>
          </div>
          <div class="modal-footer flex-nowrap p-0">
            <button type="button" class="btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" id="confirm_logout" data-bs-dismiss="modal"><strong>${lang.yes}</strong></button>
            <button type="button" class="btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0" data-bs-dismiss="modal">${lang.no}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade modal-sheet" role="dialog" id="deleteConfirm" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content rounded-3 shadow">
          <div class="modal-body p-4 text-center">
            <h5 class="mb-0">${lang.delete_prompt}</h5>
            <p> ${lang.delete_warning}</p>
          </div>
          <div class="modal-footer flex-nowrap p-0">
            <button type="button" class="btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" id="confirm_delete" data-bs-dismiss="modal"><strong>${lang.yes}</strong></button>
            <button type="button" class="btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0" data-bs-dismiss="modal">${lang.no}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade modal-sheet" role="dialog" id="editInfo" tabindex="-1" aria-hidden="true">
     <div class="modal-dialog" role="document">
        <div class="modal-content rounded-4 shadow">
          <div class="modal-header p-5 pb-4 border-bottom-0">
            <h1 class="fw-bold mb-0 fs-2">${lang.edit_prompt}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-5 pt-0">
            <form id="form_element_edit">
                <div class="form-floating mb-3">
                    <input type="text" class="form-control rounded-3" id="newUsername" maxlength="12">
                    <label for="newUsername">${lang.new_username}</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="password" class="form-control rounded-3" id="newPassword" maxlength="32" pattern="[a-zA-Z0-9]{6,}" title="${lang.password_format}">
                    <label for="newPassword">${lang.new_password}</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="password" class="form-control rounded-3" id="newPasswordConfirm" maxlength="32" pattern="[a-zA-Z0-9]{6,}" title="${lang.password_format}">
                    <label for="newPasswordConfirm">${lang.new_password_confirm}</label>
                </div>
                <div class="dropdown" id="pref_lang_drop">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="preferredLanguage" data-bs-toggle="dropdown" aria-expanded="false">
                        Preferred language
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="preferredLanguage">
                        <li><a class="dropdown-item" role="button" id="pref_lang_fr">Francais</a></li>
                        <li><a class="dropdown-item" role="button" id="pref_lang_en">English</a></li>
                        <li><a class="dropdown-item" role="button" id="pref_lang_es">Español</a></li>
                    </ul>
                </div>
                <div id="info_edit"></div>
                <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" id="edit_submit">${lang.edit}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade modal-sheet" role="dialog" id="addFriend" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content rounded-4 shadow">
                <div class="modal-header p-5 pb-4 border-bottom-0">
                    <h1 class="fw-bold mb-0 fs-2">${lang.add_friend_prompt}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-5 pt-0">
                    <form id="form_element_friend">
                        <div class="form-floating mb-3">
                        <input type="text" class="form-control rounded-3" id="friendUsername" maxlength="12" required>
                        <label for="friendUsername">${lang.username}</label>
                        </div>
                        <div id="info_friend"></div>
                        <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" id="add_friend_submit">${lang.add_friend}</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="gameChoice" tabindex="-1" role="dialog" aria-labelledby="Game mode choice" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="row">
                    <div class="col-6 game_img" id="tournament_wrapper">
                        <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2Ffe%2Fda%2F52%2Ffeda52b186ae9bd68d4849e20c9740f6.jpg&f=1&nofb=1&ipt=0f25ba90d4658c2a51f772829c59de713105745d597cf136bb6be22f972cd534&ipo=images" alt="Tournament" class="game-mode-image" id="tournament_image" data-dismiss="modal" draggable="false">
                        <h2 class="mode_text">${lang.tournament}</h2>
                    </div>
                    <div class="col-6 game_img" id="duel_wrapper">
                        <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.BmyYluamhrLDqTW1fvlFHwHaEK%26pid%3DApi&f=1&ipt=76cf6b62102c7e1df095508d3a05870d85b10236c02fa31329b81d0fddb92036&ipo=images" alt="1 versus 1" class="game-mode-image" id="duel_image" data-dismiss="modal" draggable="false">
                        <h2 class="mode_text">${lang.duel}</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <main id="profile_container" class="container py-5">
        <div class="row">
            <div class="col-lg-4" id="profile_info">
                <div class="card mb-1">
                    <div class="card-body text-center">
                        <img src="" alt="Avatar" id="profile_avatar" draggable="false">
                        <input type="file" accept="image/png" id="avatar_input" style="display: none;">
                        <h5 class="my-3" id="profile_username"></h5>
                        <div class="d-flex justify-content-center mb-2">
                            <button type="button" class="btn btn-info ms-1" id="profile_add_friend" data-bs-toggle="modal" data-bs-target="#addFriend">${lang.add_friend}</button>
                            <button type="button" class="btn btn-warning ms-1" id="profile_edit_button" data-bs-toggle="modal" data-bs-target="#editInfo">${lang.edit}</button>
                            <button type="button" class="btn btn-secondary ms-1" id="profile_logout_button" data-bs-toggle="modal" data-bs-target="#logoutConfirm">${lang.logout}</button>
                            <button type="button" class="btn btn-outline-primary ms-1" id="profile_delete_button" data-bs-toggle="modal" data-bs-target="#deleteConfirm">${lang.delete}</button>
                        </div>
                    </div>
                </div>
                <div class="card mb-1">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-sm-5">
                                <p class="mb-0">${lang.games_played}</p>
                            </div>
                            <div class="col-sm-7">
                                <p class="text-muted mb-0" id="stats_games_played"></p>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-sm-5">
                                <p class="mb-0">${lang.games_won}</p>
                            </div>
                            <div class="col-sm-7">
                                <p class="text-muted mb-0" id="stats_winrate"></p>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-sm-5">
                                <p class="mb-0">${lang.balls_hit}</p>
                            </div>
                            <div class="col-sm-7">
                                <p class="text-muted mb-0" id="stats_balls_hit"></p>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-sm-5">
                                <p class="mb-0">${lang.friends}</p>
                            </div>
                            <div class="col-sm-7">
                                <p class="text-muted mb-0" id="stats_friends_count"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 mb-1">
                <div class="card mb-1" id="leaderboard">
                    <div class="row">
                        <div class="table-responsive">
                            <table class="table table-hover caption-top">
                                <caption>${lang.leaderboard}</caption>
                                <thead>
                                    <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">${lang.name}</th>
                                    <th scope="col">${lang.played}</th>
                                    <th scope="col">${lang.won}</th>
                                    </tr>
                                </thead>
                                <tbody class="table-group-divider">
                                    <tr id="leaderboard_1">
                                    </tr>
                                    <tr id="leaderboard_2">
                                    </tr>
                                    <tr id="leaderboard_3">
                                    </tr>
                                    <tr id="leaderboard_4">
                                    </tr>
                                    <tr id="leaderboard_5">
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="d-grid gap-2 mt-5">
                            <button type="button" class="btn btn-lg btn-success ms-1" type="button" id="play_button" data-bs-toggle="modal" data-bs-target="#gameChoice">${lang.play}</button>
                            <button type="button" class="btn btn-lg btn-info ms-1" type="button" id="right_panel_button_toggle">${lang.friend_list}</button>
                        </div>
                        <p class="mt-4 mb-2 text-muted">2024 - ft_transcendence</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card mb-1" id="history">
                    <div class="row">
                        <div class="table-responsive" id="right_panel_profile">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>`;
}

// Will put a match history table on the right side (or bottom on mobile) of the screen
export function display_match_history(lang) {

    const rightPanel = document.getElementById('right_panel_profile');

    rightPanel.innerHTML = `
                        <table class="table table-hover caption-top" id="leaderboard">
                        <caption>${lang.match_history}</caption>
                        <thead>
                            <tr>
                            <th scope="col">${lang.against}</th>
                            <th scope="col">${lang.date}</th>
                            <th scope="col">${lang.won}</th>
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                            <tr id="history_1">
                            </tr>
                            <tr id="history_2">
                            </tr>
                            <tr id="history_3">
                            </tr>
                            <tr id="history_4">
                            </tr>
                            <tr id="history_5">
                            </tr>
                            <tr id="history_6">
                            </tr>
                            <tr id="history_7">
                            </tr>
                            <tr id="history_8">
                            </tr>
                            <tr id="history_9">
                            </tr>
                            <tr id="history_10">
                            </tr>
                        </tbody>
                    </table>
                    `
}

// Will put a match history table on the right side (or bottom on mobile) of the screen
export function display_friend_list(lang) {

    const rightPanel = document.getElementById('right_panel_profile');

    rightPanel.innerHTML = `
                        <table class="table table-hover caption-top" id="friend_list">
                        <caption>${lang.friend_list_title}</caption>
                        <thead>
                            <tr>
                            <th scope="col" style="width:70%">${lang.name}</th>
                            <th scope="col" style="width:30%">${lang.delete_question}</th>
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                            <tr id="friend_1">
                            </tr>
                            <tr id="friend_2">
                            </tr>
                            <tr id="friend_3">
                            </tr>
                            <tr id="friend_4">
                            </tr>
                            <tr id="friend_5">
                            </tr>
                            <tr id="friend_6">
                            </tr>
                            <tr id="friend_7">
                            </tr>
                            <tr id="friend_8">
                            </tr>
                            <tr id="friend_9">
                            </tr>
                            <tr id="friend_10">
                            </tr>
                        </tbody>
                    </table>
                    `
}

// Game page display
export function display_game_page(lang) {

    // <link href="./scss/bootstrap.css" rel="stylesheet">
    // <link href="./scss/custom.css" rel="stylesheet">

    body.innerHTML = `
    <link href="./scss/bootstrap.css" rel="stylesheet">
    <link href="./scss/custom.css" rel="stylesheet">
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            Language
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><a class="dropdown-item" role="button" id="lang_fr">Francais</a></li>
            <li><a class="dropdown-item" role="button" id="lang_en">English</a></li>
            <li><a class="dropdown-item" role="button" id="lang_es">Español</a></li>
        </ul>
    </div>
    <div id="scene-container" class="card-container py-0">

        <div id="titleRow" class="row">
            <div id="titleGame" class="card mb-0 mt-0"></div>
        </div>

        <div class="row" id="row_game">
            <div class="col-md-10">
                <div id="game" class="card">
                    <!-- Container for Pong game -->
                </div>
            </div>
            <div class="col-md-2">
                <div id="right_panel" class="card">
                    <div class="row">
                        <div id="buttons-container" class="card text-center">
                            <button id="start_button" class="btn btn-primary mt-1 mb-1 btn-tooltip" type="button">
                                Start
                                <span class="tooltiptext-btn">Click to start the game</span>
                            </button>
                            <button id="reset_button" class="btn btn-primary mt-1 mb-1 btn-tooltip custom-button" type="button">
                                Reset Camera
                                <span class="tooltiptext-btn">Reset the camera position</span>
                            </button>

                            <!-- Button trigger offcanvas -->
                            <button type="button" class="btn btn-primary mt-1 mb-1 btn-tooltip custom-button" id="toogleButton">
                                Personalization
                            </button>

                            <!-- Offcanvas left -->
                            <div class="offcanvas offcanvas-start" data-bs-backdrop="false" id="offcanvasLeft" aria-labelledby="offcanvasLeftLabel">
                                <div class="offcanvas-header">
                                    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" style="margin: 0;"></button>
                                    <h5 class="offcanvas-title" id="offcanvasLeftLabel">Customization</h5>
                                </div>
                            <div class="offcanvas-body">
                            <h3 class="text-center">Left Player</h3>
                            <!-- First Carousel -->
                            <div id="carousel1" class="carousel slide" data-bs-interval="false" style="height :200px; width: 350px;">
                                <div class="carousel-inner" id="carousel1_inner" >
                                    <!-- Carousel items will be added here -->
                                </div>
                                <button class="carousel-control-prev" type="button" data-bs-target="#carousel1" data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon" style="background-color : black;"></span>
                                    <span class="visually-hidden">Previous</span>
                                </button>
                                <button class="carousel-control-next" type="button" data-bs-target="#carousel1" data-bs-slide="next">
                                    <span class="carousel-control-next-icon" style="background-color : black;" ></span>
                                    <span class="visually-hidden">Next</span>
                                </button>
                            </div>

                            <hr>
                            <h3 class="text-center">Right Player</h3>
                            <!-- Second Carousel -->
                            <div id="carousel2" class="carousel slide" data-bs-interval="false" style="height :200px; width: 350px;">
                                <div class="carousel-inner">
                                    <!-- Carousel items will be added here -->
                                </div>
                                <button class="carousel-control-prev" type="button" data-bs-target="#carousel2" data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon" style="background-color : black;"></span>
                                    <span class="visually-hidden">Previous</span>
                                </button>
                                <button class="carousel-control-next" type="button" data-bs-target="#carousel2" data-bs-slide="next">
                                    <span class="carousel-control-next-icon" style="background-color : black;" ></span>
                                    <span class="visually-hidden">Next</span>
                                </button>
                            </div>
                            <hr>
                            <form> 
                                <div class="form-group">
                                    <h3 class="text-center">Obstacles</h3>
                                    <input type="email" class="form-control" id="obstacleInput" placeholder="Number between 1 and 10 (blanck for default)">
                                    <button type="button" class="btn btn-primary" id="obstacleButtonAdd" >Add</button>
                                    <button type="button" title="Remove obstacles" class="btn btn-primary" id="obstacleButtonRemove" >Remove</button>
                                </div>
                            </form>
                            </div>
                            <div class="offcanvas-footer">
                                <button type="button" class="btn btn-secondary" id="close_button2" data-bs-dismiss="offcanvas">Close</button>
                                <button type="button" class="btn btn-primary" id="save_button2" >Save changes</button>
                                <button type="button" class="btn btn-primary" id="reset_button2" >Reset characters</button>
                            </div>
                            </div>
                            <!-- Offcanvas end -->

                            <button type="button" class="btn btn-primary mt-1 mb-1 btn-tooltip" data-bs-toggle="modal" data-bs-target="#settingModal" id="settingButton" >
                                Settings
                                <span class="tooltiptext-btn">Change game settings</span>
                            </button>
                            <div class="modal fade" id="settingModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">Settings</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <p style="text-decoration:underline">Choose what you want to add :</p>
                                            <div class="form-check form-switch">
                                                <input class="form-check-input" type="checkbox" id="SwitchCheckBirdsTheme" data-related="birds">
                                                <label class="form-check-label" for="flexSwitchCheckBirds">Birds Theme</label>
                                            </div>
                                            <div class="form-check form-switch">
                                                <input class="form-check-input" type="checkbox" id="SwitchCheckSambaTheme" data-related="samba">
                                                <label class="form-check-label" for="flexSwitchCheckSamba">Samba Theme</label>
                                            </div>
                                            <p style="padding-top: 20px; text-decoration:underline">Choose your theme :</p>
                                            <div class="form-check form-switch">
                                                <input class="form-check-input" type="checkbox" id="SwitchCheckOceanTheme" data-related="Theme">
                                                <label class="form-check-label" for="flexSwitchCheckOcean">Ocean Theme</label>
                                            </div>
                                            <div class="form-check form-switch">
                                                <input class="form-check-input" type="checkbox" id="SwitchCheckFootTheme" data-related="Theme">
                                                <label class="form-check-label" for="flexSwitchCheckFoot">Foot Theme</label>
                                            </div>
                                            <div class="form-check form-switch">
                                                <input class="form-check-input" type="checkbox" id="SwitchCheckNeonTheme" data-related="Theme">
                                                <label class="form-check-label" for="flexSwitchCheckNeon">Neon Theme</label>
                                            </div>
                                            <div class="form-check form-switch">
                                                <input class="form-check-input" type="checkbox" id="SwitchCheckPongTheme" data-related="Theme">
                                                <label class="form-check-label" for="flexSwitchCheckPong">Pong Theme</label>
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="save_button" >Save changes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr style="margin:5px;">
                            <div class="card mt-1 mb-1 difficulty-options h-50">
                                <label for="difficultyRange" class="label-col-sm-3">
                                    Difficulty Level
                                    <span class="tooltiptext">Choose your difficulty</span>
                                </label>
                                <input type="range" value="0" class="custom-range label-col-sm-3" id="difficultyRange" min="1" max="10" value="5">
                            </div>
                            <hr style="margin:5px;">
                            <div class="card mt-1 mb-1 difficulty-options h-50">
                                <label for="paddleSize" class="label-col-sm-3">Paddle Size :</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="paddleSize" id="extraSmallPaddle" value="extraSmall">
                                    <label class="form-check-label" for="extraSmallPaddle">
                                        Extra Small
                                        <span class="tooltiptext">Choose this for an extra Small paddle</span>
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="paddleSize" id="smallPaddle" value="small">
                                    <label class="form-check-label" for="smallPaddle">
                                        Small
                                        <span class="tooltiptext">Choose this for a smaller paddle</span>
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="paddleSize" id="mediumPaddle" value="medium" checked>
                                    <label class="form-check-label" for="mediumPaddle">
                                        Medium
                                        <span class="tooltiptext">Choose this for a Medium paddle</span>
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="paddleSize" id="largePaddle" value="large">
                                    <label class="form-check-label" for="largePaddle">
                                        Large
                                        <span class="tooltiptext">Choose this for a large paddle</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div id="scoreboard" class="card">
                    <div class="row text-center">
                        <div class="col-sm-2">
                            <img src="" alt="Avatar" id="profile_avatar_left" class="avatar" draggable="false">
                        </div>
                        <div class="col-sm-3">
                            <h1 id='player1'>Player 1</h1>
                        </div>
                        <div class="col-sm-2">
                            <h1> <span class="scores" id="Right_Player">0</span> - <span class="scores" id="Left_Player">0</span></h1>
                        </div>
                        <div class="col-sm-3">
                            <h1 id='player1'>Player 2</h1>
                        </div>
                        <div class="col-sm-2">
                            <img src="" alt="Avatar" id="profile_avatar_right" class="avatar" draggable="false">
                        </div>
                    </div>
                    <hr>
                    <div class="col-sm-3 text-center mx-auto" style="">
                        <h2 id='winnerBoard' >First to 5 wins!</h2>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-sm-2 text-end">
                            <h3 id='Rules'>How to play </h3>
                        </div>
                        <div class="col-sm-9">
                            <h3>- Space to start
                            <br>- w → up
                            <br>- s → down</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="./bootstrap/js/bootstrap.bundle.js" defer></script>
    <script src="./js/main.js" defer></script>
    <script type="module" src="./game/src/title.js" defer></script>
    <script type="module" src="./game/src/game.js" defer></script>
    `;
};


export function display_404(lang) {
    body.innerHTML = `
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            Language
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><a class="dropdown-item" role="button" id="lang_fr">Francais</a></li>
            <li><a class="dropdown-item" role="button" id="lang_en">English</a></li>
            <li><a class="dropdown-item" role="button" id="lang_es">Español</a></li>
        </ul>
    </div>
    <div class="row">
        <div class="card mb-1">
            <div class="card-body">
                <div class="row text-center">
                    <h1 class="display-1">404</h1>
                    <h2>${lang.page_not_found}</h2>
                </div>
            </div>
        </div>
    </div>`
}

export function display_403(lang) {
    body.innerHTML = `
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            Language
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><a class="dropdown-item" role="button" id="lang_fr">Francais</a></li>
            <li><a class="dropdown-item" role="button" id="lang_en">English</a></li>
            <li><a class="dropdown-item" role="button" id="lang_es">Español</a></li>
        </ul>
    </div>
    <div class="row">
        <div class="card mb-1">
            <div class="card-body">
                <div class="row text-center">
                    <h1 class="display-1">403</h1>
                    <h2>${lang.forbidden}</h2>
                    <h4>${lang.forbidden_message}</h4>
                    <button id="home_button" class="btn btn-primary mt-1 mb-1" type="button">${lang.home}</button>
                </div>
            </div>
        </div>
    </div>`
}

export function display_duel_login_page(lang) {
    body.innerHTML = `
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            Language
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><a class="dropdown-item" role="button" id="lang_fr">Francais</a></li>
            <li><a class="dropdown-item" role="button" id="lang_en">English</a></li>
            <li><a class="dropdown-item" role="button" id="lang_es">Español</a></li>
        </ul>
    </div>
    <div class="row">
        <div class="card m-1">
            <div class="card-body duel_card" id="duel_host">
                <div class="row text-center">
                    <img src="" alt="Avatar" id="duel_host_avatar" class="user_avatar" draggable="false">
                    <h4 class="my-3" id="duel_host_username"></h4>
                    <p class="mt-4 mb-2 text-muted text-end">${lang.host}</p>
                </div>
            </div>
        </div>
        <div class="card m-1">
            <div class="card-body duel_card" id="duel_guest">
            </div>
        </div>
        <div class="col-12 me-1">
            <div id="start_button_location"></div>
        </div>
    </div>`
}

export function display_tournament_login_page(lang) {


    body.innerHTML = `
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            Language
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><a class="dropdown-item" role="button" id="lang_fr">Francais</a></li>
            <li><a class="dropdown-item" role="button" id="lang_en">English</a></li>
            <li><a class="dropdown-item" role="button" id="lang_es">Español</a></li>
        </ul>
    </div>
    <div class="row">
        <div class="col-5 me-1">
            <div class="row">
                <div class="card m-1">
                    <div class="card-body tournament_card" id="tournament_user_1">
                        <div class="row text-center">
                            <img src="" alt="Avatar" id="tournament_user_1_avatar" class="user_avatar" draggable="false">
                            <h4 class="my-3" id="tournament_user_1_username"></h4>
                            <p class="mt-4 mb-2 text-muted text-end">${lang.host}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="card m-1">
                    <div class="card-body tournament_card" id="tournament_user_2">
                    </div>
                </div>
            </div>
        </div>
        <div class="col-5 me-1">
            <div class="row">
                <div class="card m-1">
                    <div class="card-body tournament_card" id="tournament_user_3">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="card m-1">
                    <div class="card-body tournament_card" id="tournament_user_4">
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 me-1">
            <div id="start_button_location"></div>
        </div>
    </div>
    <script src="./bootstrap/js/bootstrap.bundle.js" defer></script>
    <script type="module" src="./js/main.js" defer></script>
    `
}

export function display_tournament_order_page(lang) {
    body.innerHTML = `
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            Language
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><a class="dropdown-item" role="button" id="lang_fr">Francais</a></li>
            <li><a class="dropdown-item" role="button" id="lang_en">English</a></li>
            <li><a class="dropdown-item" role="button" id="lang_es">Español</a></li>
        </ul>
    </div>
    <div class="row">
        <div class="card mb-1" id="tournamentOrderCard">
            <div class="card-body">
                <div class="row">
                <div class="col-6">
                    <h3>${lang.players}:</h3>
                    <img src="" alt="Avatar" id="player1_avatar" class="user_avatar avatar_small" draggable="false">
                    <h4 class="my-3 text-center" id="player1_username"></h4>
                    <hr/>
                    <img src="" alt="Avatar" id="player2_avatar" class="user_avatar avatar_small" draggable="false">
                    <h4 class="my-3 text-center" id="player2_username"></h4>
                    <hr/>
                    <img src="" alt="Avatar" id="player3_avatar" class="user_avatar avatar_small" draggable="false">
                    <h4 class="my-3 text-center" id="player3_username"></h4>
                    <hr/>
                    <img src="" alt="Avatar" id="player4_avatar" class="user_avatar avatar_small" draggable="false">
                    <h4 class="my-3 text-center" id="player4_username"></h4>
                </div>
                <div class="col-6">
                    <h3 id="tree">${lang.matches}:</h3>
                    <section id="bracket">
                        <div id="tournament_tree">
                            <div class="split split-one">
                                <div class="round round-one current">
                                    <div class="round-details">${lang.round1}</div>
                                    <ul class="matchup">
                                        <section id="game1">
                                        <li class="team team-top" id="game1_p1">--<span class="score" id="game1_p1_score">-</span></li>
                                        <li class="team team-bottom" id="game1_p2">--<span class="score" id="game1_p2_score">-</span></li>
                                        </section>
                                    </ul>
                                    <ul class="matchup">
                                        <section id="game2">
                                        <li class="team team-top" id="game2_p1">--<span class="score" id="game2_p1_score">-</span></li>
                                        <li class="team team-bottom" id="game2_p2">--<span class="score" id="game2_p2_score">-</span></li>
                                        </section>
                                    </ul>
                                </div>

                                <div class="round round-two">
                                    <div class="round-details">${lang.round2}</div>
                                    <ul class="matchup">
                                        <section id="game4">
                                        <li class="team team-top" id="game4_p1">--<span class="score" id="game4_p1_score">-</span></li>
                                        <li class="team team-bottom" id="game4_p2">--<span class="score" id="game4_p2_score">-</span></li>
                                        </section>
                                    </ul>
                                    <ul class="matchup">
                                        <section id="game3">
                                        <li class="team team-top" id="game3_p1">--<span class="score" id="game3_p1_score">-</span></li>
                                        <li class="team team-bottom" id="game3_p2">--<span class="score" id="game3_p2_score">-</span></li>
                                        </section>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                    <button class="btn btn-lg btn-danger my-2 w-100" id="next_match_input">Next match !</button>
                </div>
                </div>
            </div>
        </div>
    </div>
    `
}
