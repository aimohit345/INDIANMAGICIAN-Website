/**
 * Centralized API client for all backend endpoints
 */

const BASE_URL = '/api';

export async function fetchAllData() {
  const res = await fetch(`${BASE_URL}/all`);
  if (!res.ok) throw new Error('Failed to fetch site data');
  return res.json();
}

export async function updateSettings(data) {
  const res = await fetch(`${BASE_URL}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateAbout(data) {
  const res = await fetch(`${BASE_URL}/about`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Collage
export async function addCollagePhoto(photo) {
  const res = await fetch(`${BASE_URL}/collage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(photo),
  });
  return res.json();
}

export async function updateCollagePhoto(id, photo) {
  const res = await fetch(`${BASE_URL}/collage/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(photo),
  });
  return res.json();
}

export async function deleteCollagePhoto(id) {
  const res = await fetch(`${BASE_URL}/collage/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

// Testimonials
export async function addTestimonial(testimonial) {
  const res = await fetch(`${BASE_URL}/testimonials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testimonial),
  });
  return res.json();
}

export async function updateTestimonial(id, testimonial) {
  const res = await fetch(`${BASE_URL}/testimonials/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testimonial),
  });
  return res.json();
}

export async function deleteTestimonial(id) {
  const res = await fetch(`${BASE_URL}/testimonials/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

// YouTube Videos
export async function addYoutubeVideo(video) {
  const res = await fetch(`${BASE_URL}/videos/youtube`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(video),
  });
  return res.json();
}

export async function updateYoutubeVideo(id, video) {
  const res = await fetch(`${BASE_URL}/videos/youtube/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(video),
  });
  return res.json();
}

export async function deleteYoutubeVideo(id) {
  const res = await fetch(`${BASE_URL}/videos/youtube/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

// Instagram Reels
export async function addInstagramReel(reel) {
  const res = await fetch(`${BASE_URL}/videos/reels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reel),
  });
  return res.json();
}

export async function updateInstagramReel(id, reel) {
  const res = await fetch(`${BASE_URL}/videos/reels/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reel),
  });
  return res.json();
}

export async function deleteInstagramReel(id) {
  const res = await fetch(`${BASE_URL}/videos/reels/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function updateReelsLayout(layout) {
  const res = await fetch(`${BASE_URL}/videos/reels-layout`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ layout }),
  });
  return res.json();
}

// Highlights (1x3 Row)
export async function updateHighlights(highlights) {
  const res = await fetch(`${BASE_URL}/videos/highlights`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(highlights),
  });
  return res.json();
}

// News
export async function addNewsItem(news) {
  const res = await fetch(`${BASE_URL}/news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(news),
  });
  return res.json();
}

export async function updateNewsItem(id, news) {
  const res = await fetch(`${BASE_URL}/news/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(news),
  });
  return res.json();
}

export async function deleteNewsItem(id) {
  const res = await fetch(`${BASE_URL}/news/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

// Dynamic Sections
export async function addSection(section) {
  const res = await fetch(`${BASE_URL}/sections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(section),
  });
  return res.json();
}

export async function updateSection(id, section) {
  const res = await fetch(`${BASE_URL}/sections/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(section),
  });
  return res.json();
}

export async function deleteSection(id) {
  const res = await fetch(`${BASE_URL}/sections/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

// Dynamic Pages
export async function addPage(page) {
  const res = await fetch(`${BASE_URL}/pages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(page),
  });
  return res.json();
}

export async function updatePage(id, page) {
  const res = await fetch(`${BASE_URL}/pages/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(page),
  });
  return res.json();
}

export async function deletePage(id) {
  const res = await fetch(`${BASE_URL}/pages/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

// Contact Form Inquiries
export async function submitContactInquiry(inquiry) {
  const res = await fetch(`${BASE_URL}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiry),
  });
  return res.json();
}

export async function markInquiryAsRead(id) {
  const res = await fetch(`${BASE_URL}/inquiries/${id}/read`, {
    method: 'PUT',
  });
  return res.json();
}

export async function deleteInquiry(id) {
  const res = await fetch(`${BASE_URL}/inquiries/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

// File Upload
export async function uploadImageFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

// Admin Auth
export async function adminLogin(password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return res.json();
}
