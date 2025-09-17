// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate3d(${mouseX - 10}px, ${mouseY - 10}px, 0)`;
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    cursorFollower.style.transform = `translate3d(${followerX - 20}px, ${followerY - 20}px, 0)`;
    requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor interactions
const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform += ' scale(1.5)';
        cursorFollower.style.transform += ' scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
        cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(1.5)', '');
    });
});

// Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('three-canvas'),
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
scene.fog = new THREE.FogExp2(0x0a0a0a, 0.002);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 3000;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0xD4AF37,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Floating geometric shapes
const geometries = [
    new THREE.TetrahedronGeometry(0.5, 0),
    new THREE.OctahedronGeometry(0.5, 0),
    new THREE.IcosahedronGeometry(0.5, 0),
    new THREE.DodecahedronGeometry(0.5, 0)
];

const materials = [
    new THREE.MeshBasicMaterial({ 
        color: 0xD4AF37, 
        transparent: true, 
        opacity: 0.1,
        wireframe: true
    }),
    new THREE.MeshBasicMaterial({ 
        color: 0xCD7F32, 
        transparent: true, 
        opacity: 0.1,
        wireframe: true
    })
];

const shapes = [];
for (let i = 0; i < 15; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.x = (Math.random() - 0.5) * 50;
    mesh.position.y = (Math.random() - 0.5) * 50;
    mesh.position.z = (Math.random() - 0.5) * 50;
    
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    shapes.push(mesh);
    scene.add(mesh);
}

camera.position.z = 30;

// Mouse interaction for Three.js
let mouseXNormalized = 0;
let mouseYNormalized = 0;

document.addEventListener('mousemove', (event) => {
    mouseXNormalized = (event.clientX / window.innerWidth) * 2 - 1;
    mouseYNormalized = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate particles
    particlesMesh.rotation.x += 0.0005;
    particlesMesh.rotation.y += 0.0005;

    // Animate shapes
    shapes.forEach((shape, index) => {
        shape.rotation.x += 0.005 + index * 0.001;
        shape.rotation.y += 0.005 + index * 0.001;
        shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
    });

    // Camera movement based on mouse
    camera.position.x += (mouseXNormalized * 2 - camera.position.x) * 0.01;
    camera.position.y += (mouseYNormalized * 2 - camera.position.y) * 0.01;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Enhanced card interactions (updated to work with new project cards)
const skillCardElements = document.querySelectorAll('.skill-card');
const projectCards = document.querySelectorAll('.project-card');

// Skill cards keep the 3D tilt effect
skillCardElements.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) rotateX(5deg)';
        this.style.boxShadow = '0 30px 60px rgba(212, 175, 55, 0.2)';
    });
    
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `translateY(-15px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg)';
        this.style.boxShadow = 'none';
    });
});

// Project cards have hover effects handled by CSS since they need click functionality
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalTags = document.getElementById('modalTags');
const modalClose = document.querySelector('.modal-close');

// Project data for modal
const projectData = {
    'luxury-brand': {
        title: 'Porsche car',
        tags: ['Blender']
    },
    'art-installation': {
        title: 'Futuristic City',
        tags: ['Blender','Photoshop']
    },
    'agency-site': {
        title: 'Environment for Advertisement',
        tags: ['Blender']
    },
    'mobile-app': {
        title: 'Fantasy concept art',
        tags: ['Unreal Engine','Blender']
    },
    'ecommerce': {
        title: 'Realistic render',
        tags: ['Unreal Engine','Blender']
    },
    'dashboard': {
        title: 'Virtual showroom for BMW',
        tags: ['UNREAL Engine','Blender','Xcode']
    }
};

// Add click event to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function() {
        const projectKey = this.getAttribute('data-project');
        const projectImg = this.querySelector('.project-image');
        const project = projectData[projectKey];
        
        if (project && projectImg) {
            // Set modal content
            modalImage.src = projectImg.src;
            modalImage.alt = projectImg.alt;
            modalTitle.textContent = project.title;
            
            // Clear and populate tags
            modalTags.innerHTML = '';
            project.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag';
                tagElement.textContent = tag;
                modalTags.appendChild(tagElement);
            });
            
            // Show modal with animation
            imageModal.classList.add('show');
            imageModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    });
});

// Close modal functionality
function closeModal() {
    imageModal.classList.remove('show');
    imageModal.classList.add('hide');
    document.body.style.overflow = 'auto'; // Restore scrolling
    
    setTimeout(() => {
        imageModal.style.display = 'none';
        imageModal.classList.remove('hide');
    }, 300);
}

// Close modal events
modalClose.addEventListener('click', closeModal);

// Close modal when clicking outside the image
imageModal.addEventListener('click', function(e) {
    if (e.target === imageModal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && imageModal.style.display === 'block') {
        closeModal();
    }
});

// Prevent modal close when clicking on image or modal content
modalImage.addEventListener('click', function(e) {
    e.stopPropagation();
});

document.querySelector('.modal-info').addEventListener('click', function(e) {
    e.stopPropagation();
});

// EmailJS Configuration
// Initialize EmailJS with your public key
emailjs.init("9mr0e9PXDYzitYete"); // Replace with your EmailJS public key

// Form submission with Gmail integration
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        message: formData.get('message'),
        to_email: 'adityas112004@gmail.com'
    };

    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.7';

    // Send email using EmailJS v4
    emailjs.send('service_24ivk6o', 'template_0xwgrty', templateParams)
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            submitButton.textContent = 'Message Sent! ✓';
            submitButton.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
            submitButton.style.opacity = '1';
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.style.background = '';
                submitButton.disabled = false;
                contactForm.reset();
            }, 3000);
        })
        .catch((error) => {
            console.log('FAILED...', error);
            submitButton.textContent = 'Failed to Send ✗';
            submitButton.style.background = 'linear-gradient(45deg, #dc3545, #c82333)';
            submitButton.style.opacity = '1';
            showNotification('Failed to send message. Please try again or email directly.', 'error');
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.style.background = '';
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
            }, 3000);
        });
});

// Notification system
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : '✗'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary-gold)' : '#dc3545'};
        color: var(--bg-dark);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        font-weight: 500;
    `;
    
    // Add notification to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Add styles for notification
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-icon {
        font-weight: bold;
        font-size: 1.2rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: auto;
        padding: 0 5px;
        opacity: 0.7;
        transition: opacity 0.2s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(notificationStyles);

// Remove problematic scroll effects that might cause spacing issues
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Typing effect for hero text
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    setTimeout(type, 1500);
}

// Initialize typing effect
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    const originalText = heroTitle.textContent;
    typeWriter(heroTitle, originalText, 80);
});

// Magnetic effect for buttons
const magneticElements = document.querySelectorAll('.btn-primary, .btn-secondary');

magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        el.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0px, 0px)';
    });
});

// Skill card progress animation
const skillCards = document.querySelectorAll('.skill-card');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.opacity = '1';
            }, index * 200);
        }
    });
}, {
    threshold: 0.1
});

skillCards.forEach((card, index) => {
    card.style.transform = 'translateY(50px)';
    card.style.opacity = '0';
    card.style.transition = 'all 0.8s ease';
    skillObserver.observe(card);
});

// Hide cursor on mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (isMobile) {
    cursor.style.display = 'none';
    cursorFollower.style.display = 'none';
    document.body.style.cursor = 'auto';
}

// Performance optimization
let ticking = false;

function updateCursor() {
    if (!ticking) {
        requestAnimationFrame(() => {
            ticking = false;
        });
        ticking = true;
    }
}

// Add loading screen fade out
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Additional interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Add hover sound effect simulation (visual feedback)
    const hoverElements = document.querySelectorAll('.nav-links a, .btn-primary, .btn-secondary');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            // Create a small ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(212, 175, 55, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (rect.width - size) / 2 + 'px';
            ripple.style.top = (rect.height - size) / 2 + 'px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Smooth reveal animations for sections
const revealElements = document.querySelectorAll('.section-header, .about-grid, .skills-container, .projects-grid, .contact-container');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease';
    revealObserver.observe(el);
});

// Remove the problematic parallax scroll effect that was causing spacing issues
// This has been removed to fix layout problems

// Create floating particles that follow cursor
let particles = [];
const maxParticles = 5;

function createParticle(x, y) {
    if (particles.length >= maxParticles) {
        particles.shift();
    }
    
    const particle = {
        x: x,
        y: y,
        life: 30,
        decay: 0.95
    };
    
    particles.push(particle);
}

function updateParticles() {
    particles.forEach((particle, index) => {
        particle.life *= particle.decay;
        
        if (particle.life < 1) {
            particles.splice(index, 1);
        }
    });
    
    requestAnimationFrame(updateParticles);
}

// Initialize particle system
updateParticles();

