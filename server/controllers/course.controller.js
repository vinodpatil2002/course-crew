import Course from "../models/course.model";
import { errorHandler } from "../utils/error";

export const createCourse = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler("How the fuck did you get here?", 403));
  }
  if (!req.body.title || !req.body.content) {
    return next(
      errorHandler("Title and content are not supposed to be emtpy", 400)
    );
  }
  const slug = req.body.title
    .toLowerCase()
    .split(" ")
    .join("")
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newCourse = new Course({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(errorHandler(500, err.message));
  }
};

export const getCourses = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.limit === "asc" ? 1 : -1;
    const course = await Course.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.slug && { slug: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.courseId && { _id: req.query.courseId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalCourses = await Course.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthCourses = await Course.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ course, totalCourses, lastMonthCourses });
  } catch (error) {
    next(errorHandler(error.message, 500));
  }
};

export const updateCourse = async (req, res, next) => {
    if(!req.user.isAdmin || req.user.id !== req.body.userId) {
        return next(errorHandler("You are not allowed to do this", 403));
    }
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.courseId,{
            $set: {
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                image: req.body.image,
            }
        }, {new: true});
        res.status(200).json(updatedCourse);
    }catch(error) {
        next(errorHandler(error.message, 500));
    }
};

export const deleteCourse = async (req, res, next) => {
    if(!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler("You are not allowed to do this", 403));
    }
    try {
        await Course.findByIdAndDelete(req.params.courseId);
        res.status(200).json("Course has been deleted");
    } catch (error) {
        next(errorHandler(error.message, 500));
    }
};