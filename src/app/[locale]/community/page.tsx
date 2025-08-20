"use client";
import Masonry from "react-masonry-css";
import Header from "@/components/layout/Header";
import PostCreator from "@/app/[locale]/community/PostCreator";
import PostCard from "./PostCard";
import { PostType } from "@/types/PostType";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  collection,
  orderBy,
  query,
  limit,
  startAfter,
  getDocs,
  DocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
// import { useAuth } from "@/context/AuthContext";

const POSTS_PER_PAGE_INITIAL = 6;
const POSTS_PER_PAGE = 4;
const LOAD_MORE_MARGIN = "300px";

export default function BlogPage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  // const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot<DocumentData> | null>(
    null
  );
  const [hasMore, setHasMore] = useState(true);
  const [fetchedPostIds, setFetchedPostIds] = useState<Set<string>>(new Set());
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations('CommunityPage');
  const { user } = useAuth();

  const breakpointColumnsObj = {
    default: 2,
    1024: 2,
    1023: 1,
  };

  useEffect(() => {
    const out = async () => {
      if (user?.isBanned === true ) {
        await signOut(auth);
        toast.error('Your account has been banned.');
        return; // Stop further execution
      }
    }
    out();
  },[user])

  const fetchPosts = useCallback(
    async (initial = false) => {
      setLoading(true);

      try {
        const postsQuery = initial
          ? query(
              collection(db, "posts"),
              orderBy("createdAt", "desc"),
              limit(POSTS_PER_PAGE_INITIAL)
            )
          : query(
              collection(db, "posts"),
              orderBy("createdAt", "desc"),
              startAfter(lastDoc),
              limit(POSTS_PER_PAGE)
            );

        const snapshot = await getDocs(postsQuery);

        if (snapshot.empty) {
          setHasMore(false);
          return;
        }

        const newPosts = snapshot.docs
          .map((doc) => ({
            ...(doc.data() as PostType),
            postId: doc.id,
          }))
          .filter((post) => !fetchedPostIds.has(post.postId));

        if (newPosts.length === 0 && !initial) {
          setHasMore(false);
          return;
        }

        setPosts((prev) => (initial ? newPosts : [...prev, ...newPosts]));
        setFetchedPostIds(
          (prev) => new Set([...prev, ...newPosts.map((p) => p.postId)])
        );
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    },
    [lastDoc, fetchedPostIds]
  );

  useEffect(() => {
    fetchPosts(true);
  }, []);

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && hasMore) {
          fetchPosts();
        }
      },
      { rootMargin: LOAD_MORE_MARGIN }
    );

    if (currentRef && hasMore) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loading, hasMore, fetchPosts]);

  const renderPosts = () => {
    const uniquePosts = [...new Map(posts.map((p) => [p.postId, p])).values()];

    if (uniquePosts.length === 0 && !loading) {
      return (
        <p className="text-center mt-8 text-[#4A4947]">
          {t('noPosts')}
        </p>
      );
    }

    return (
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {uniquePosts.map(
          (post, index) =>
            post.content && (
              <motion.div
                key={post.postId}
                initial={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <PostCard
                  post={post}
                  showComment={true}
                  onPostDeleted={(deletedPostId) =>
                    setPosts((prev) =>
                      prev.filter((p) => p.postId !== deletedPostId)
                    )
                  }
                />
              </motion.div>
            )
        )}
      </Masonry>
    );
  };

  const handleNewPost = (newPost: PostType) => {
    if (!fetchedPostIds.has(newPost.postId)) {
      setPosts((prev) => [newPost, ...prev]);
      setFetchedPostIds((prev) => new Set(prev).add(newPost.postId));
    }
  };
  return (
    <>
      <Header />
      <div className="fix-height pt-[155px] pb-10 sm:px-8 md:px-16 lg:px-24 py-4">
        <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
          <PostCreator onPostCreated={handleNewPost} />
          {renderPosts()}
          {loading && (
            <div className="flex justify-center mt-4">
              <div className="animate-pulse text-[#4A4947]">
                {t('loading')}
              </div>
            </div>
          )}
          {!hasMore && posts.length > 0 && (
            <p className="text-center mt-4 text-[#4A4947]">
              {t('reach')}
            </p>
          )}
          {hasMore && <div ref={loadMoreRef} className="h-20 w-full" />}
        </div>
      </div>
    </>
  );
}
