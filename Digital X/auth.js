const SUPABASE_URL = 'https://iookqdflgqctlourzsbf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvb2txZGZsZ3FjdGxvdXJ6c2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjE1NzIsImV4cCI6MjA4OTU5NzU3Mn0.S6XgTBKWr0D3AqeTygbGcZMgEbJguZ911L09aEwo87o';

/* ═════════ REGISTRO ═════════ */
async function doRegister() {
  const fn = document.getElementById('fn').value.trim();
  const ln = document.getElementById('ln').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const pass = document.getElementById('pw').value;
  const confirmPass = document.getElementById('cpw').value;

  const nombre = (fn + ' ' + ln).trim();

  if (!fn || !ln || !email || !pass) {
    alert('Completa los campos obligatorios');
    return;
  }

  if (pass.length < 8) {
    alert('La contraseña debe tener al menos 8 caracteres');
    return;
  }

  if (pass !== confirmPass) {
    alert('Las contraseñas no coinciden');
    return;
  }

  try {
    const res = await fetch(SUPABASE_URL + '/auth/v1/signup', {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password: pass,
        data: {
          full_name: nombre,
          phone: phone
        }
      })
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(data.error_description || data.error || 'Error al registrarse');
    }

    alert('Cuenta creada correctamente');
    window.location.href = 'login.html';

  } catch (err) {
    alert(err.message);
  }
}

/* ═════════ LOGIN ═════════ */
async function doLogin() {
  const email = document.getElementById('l-email').value.trim();
  const pass = document.getElementById('l-pass').value;

  if (!email || !pass) {
    alert('Completa email y contraseña');
    return;
  }

  try {
    const res = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password: pass })
    });

    const data = await res.json();

    if (!res.ok || !data.access_token) {
      throw new Error(data.error_description || 'Credenciales incorrectas');
    }

    const token = data.access_token;
    const user = data.user;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    // 🔥 Buscar rol en tabla clientes
    const perfilRes = await fetch(
      `${SUPABASE_URL}/rest/v1/clientes?id=eq.${user.id}&select=rol`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${token}`
        }
      }
    );

    const perfil = await perfilRes.json();

    if (!perfilRes.ok || !perfil.length) {
      throw new Error('No se encontró el perfil del usuario');
    }

    const rol = perfil[0].rol;

    if (rol === 'admin') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'dashboard.html';
    }

  } catch (err) {
    alert(err.message);
  }
}

/* ═════════ LOGOUT ═════════ */
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}
