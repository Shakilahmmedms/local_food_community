
document.addEventListener('DOMContentLoaded', function() {
    const profileDiv = document.getElementById('profile');
    const authDiv = document.getElementById('auth');
    const usernameSpan = document.getElementById('username');

    // Simulate checking if the user is authenticated
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');

    if (token && userId) {
        // Fetch user details with the token and userId
        fetch(`https://food-community.onrender.com/customer/profile/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                usernameSpan.textContent = data.username;
                profileDiv.classList.remove('hidden');
                authDiv.classList.add('hidden');
            } else {
                logout();
            }
        })
        .catch(err => {
            console.error('Error fetching user profile:', err);
            logout();
        });
    } else {
        profileDiv.classList.add('hidden');
        authDiv.classList.remove('hidden');
    }
});

const handleRegistration = (event) => {
    event.preventDefault();
    const username = getValue('username');
    const first_name = getValue('first_name');
    const email = getValue('email');
    const last_name = getValue('last_name');
    const password = getValue('password');
    const confirm_password = getValue('confirm_password');

    const info = {
        username,
        first_name,
        last_name,
        email,
        password,
        confirm_password
    };

    if (password === confirm_password) {
        document.getElementById('error').innerText = '';
        if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)) {
            console.log(info);
            fetch('https://food-community.onrender.com/customer/register/', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(info)
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.username) {
                    alert('Registration successful. You can now login.');
                }
            })
            .catch(err => console.error('Error:', err));
        } else {
            document.getElementById('error').innerText = 'Password must contain at least eight characters, including one letter, one number, and one special character.';
        }
    } else {
        document.getElementById('error').innerText = 'Password and Confirm Password did not match';
    }
};

const getValue = (id) => {
    return document.getElementById(id).value;
};

const handleLogin = (event) => {
    event.preventDefault();
    const username = getValue("login-username");
    const password = getValue("login-password");
    console.log(username, password);
    if (username && password) {
        fetch("https://food-community.onrender.com/customer/login/", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ username, password })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.token && data.user_id) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user_id", data.user_id);
                window.location.href = 'index.html'
            }
        })
        .catch(err => console.error('Error:', err));
    }
};


const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    window.location.reload();
};
