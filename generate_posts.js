import fs from 'fs';

const DB_PATH = 'c:\\Users\\admin\\OneDrive\\Desktop\\WEB BACKEND\\news-portal\\db.json';

try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    const db = JSON.parse(data);

    let maxId = 0;
    db.posts.forEach(p => {
        if (typeof p.id === 'number' && p.id > maxId) maxId = p.id;
    });

    const categories = ['Đời Sống', 'Chuyện Lạ', 'Showbiz', 'Tâm Linh', 'Ẩm Thực', 'Công Nghệ'];
    const newPosts = [];

    for (let i = 1; i <= 20; i++) {
        const id = maxId + i;
        const isEven = i % 2 === 0;

        newPosts.push({
            id: id,
            title: `Tin Cực Sốc ${i}: Sự thật về việc không làm gì cũng có ăn`,
            thumbnail: `https://picsum.photos/id/${100 + i}/800/450`,
            content: `<p><strong>(Báo Lá Cải) - Đây là bài báo demo số ${i} nhằm mục đích lấp đầy nội dung.</strong></p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <h3>Tại sao lại như vậy?</h3>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <blockquote>"Trích dẫn vô nghĩa nhưng nghe có vẻ triết lý để bài viết trông xịn hơn." - Một người qua đường</blockquote>
                <p><em>Bài viết này không có ý nghĩa gì cả, chỉ để test giao diện đẹp trai của bạn thôi.</em></p>`,
            userId: isEven ? 2 : 1, // supporting schema
            author_id: isEven ? 2 : 1, // supporting schema fallback
            category: categories[Math.floor(Math.random() * categories.length)],
            created_at: new Date(Date.now() - i * 86400000).toISOString().split('T')[0], // Backdated by i days
            views: Math.floor(Math.random() * 5000) + 500
        });
    }

    // Preserve existing posts and append new ones
    // Actually, user said "add", but in previous turns I might have overwritten some. 
    // I will KEEP existing posts and ADD news ones.
    // Wait, the view_file above will confirm if I should keep or replace. 
    // Usually appending is safer.

    db.posts = [...db.posts, ...newPosts];

    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    console.log('Successfully added 20 posts.');

} catch (err) {
    console.error('Error:', err);
}
