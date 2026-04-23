from app.models.category import Category
from app.configs.database_config import db
from sqlalchemy import func

def find_category_by_id(id):
    category = Category.query.get(id)
    if not category:
        raise Exception("Danh mục không tồn tại")
    return category

def find_category(data, is_admin=False):
    name = data.get("name", "").strip()

    query = Category.query
    if not is_admin:
        query = query.filter(Category.active.is_(True))
        
    if name:
        query = query.filter(Category.name.ilike(f"%{name}%"))

    return query.all()

def get_category_tree():
    categories = Category.query.filter_by(active=True).all()

    category_dict = {}
    for c in categories:
        category_dict[c.id] = {
            "id": c.id,
            "name": c.name,
            "parent_id": c.parent_id,
            "children": []
        }

    root = []

    for c in category_dict.values():
        if c["parent_id"] is not None:
            parent = category_dict.get(c["parent_id"])
            if parent:
                parent["children"].append(c)
        else:
            root.append(c)

    return root

def build_tree_with_level():
    def add_level(nodes, level=0):
        for n in nodes:
            n["level"] = level
            add_level(n["children"], level + 1)

    tree = get_category_tree()
    add_level(tree)
    return tree

def add_category(data):
    name = data.get("name", "").strip()
    parent_id = data.get("parent_id")

    if not name:
        raise Exception("Tên không được để trống")

    existed = Category.query.filter(
        func.lower(Category.name) == name.lower()
    ).first()
    if existed:
        raise Exception("Danh mục đã tồn tại")

    if parent_id is not None:
        parent = Category.query.get(parent_id)
        if not parent:
            raise Exception("Danh mục cha không tồn tại")

    new_category = Category(
        name=name,
        parent_id=parent_id
    )

    db.session.add(new_category)
    db.session.commit()

    return new_category

def is_descendant(parent, child_id):
    if not parent:
        return False
    if parent.id == child_id:
        return True
    return is_descendant(parent.parent, child_id)

def update_active_recursive(category, active):
    category.active = active
    for child in category.children:
        update_active_recursive(child, active)

def update_category(id, data):
    category = Category.query.get(id)

    if not category:
        raise Exception("Danh mục không tồn tại")

    name = data.get("name")
    parent_id = data.get("parent_id")
    active = data.get("active")

    if name is not None:
        name = name.strip()
        existed = Category.query.filter(
            func.lower(Category.name) == name.lower()
        ).first()

        if existed and existed.id != id:
            raise Exception("Tên danh mục đã tồn tại")

        category.name = name

    if parent_id is not None:
        if parent_id == id:
            raise Exception("Không thể chọn chính nó làm cha")

        parent = Category.query.get(parent_id)
        if not parent:
            raise Exception("Danh mục cha không tồn tại")
        
        if is_descendant(parent, id):
            raise Exception("Không thể tạo vòng lặp danh mục")

        category.parent_id = parent_id

    if active is not None and category.active != active:
        update_active_recursive(category, active)

    db.session.commit()

    return category