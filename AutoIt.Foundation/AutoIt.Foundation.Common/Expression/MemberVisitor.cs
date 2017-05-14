using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using AutoIt.Foundation.Common.ClassHelper;

namespace AutoIt.Foundation.Common.Expression
{
    public class MemberVisitor : ExpressionVisitor
    {
        private Dictionary<System.Linq.Expressions.Expression, object> _ValueDic = new Dictionary<System.Linq.Expressions.Expression, object>();

        #region API

        public T GetValue<T>(Expression<Func<T>> func)
        {
            return (T)GetValue((System.Linq.Expressions.Expression)func);
        }

        public object GetValue(System.Linq.Expressions.Expression exp)
        {
            _ValueDic.Clear();

            if (exp == null)
            {
                return null;
            }

            var result = Visit(exp);
            return GetCacheValue(result);
        }

        public MemberVisitor SetValue<T>(Expression<Func<T>> func, object val)
        {
            SetValue((System.Linq.Expressions.Expression)func, val);

            return this;
        }

        public MemberVisitor SetValue(System.Linq.Expressions.Expression exp, object val)
        {
            if (exp.NodeType == ExpressionType.Lambda)
            {
                exp = ((LambdaExpression)exp).Body;
            }

            if (exp.NodeType == ExpressionType.MemberAccess)
            {
                var memberAccess = (MemberExpression)exp;
                var member = memberAccess.Member;
                var obj = GetValue(memberAccess.Expression);
                member.SetValue(obj, val);
            }
            else if (exp.NodeType == ExpressionType.ArrayIndex)
            {
                var arrayIndex = (BinaryExpression)exp;
                var array = (Array)GetValue(arrayIndex.Left);
                var index = (int)GetValue(arrayIndex.Right);
                array.SetValue(val, index);
            }

            return this;
        }

        #endregion

        #region Common
        private object GetCacheValue(System.Linq.Expressions.Expression exp)
        {
            return _ValueDic[exp];
        }
        #endregion

        #region  Core

        protected override System.Linq.Expressions.Expression VisitLambda(LambdaExpression lambda)
        {
            var result = base.VisitLambda(lambda);
            _ValueDic.Add(result, GetCacheValue(lambda.Body));
            return result;
        }

        protected override System.Linq.Expressions.Expression VisitMemberAccess(MemberExpression m)
        {
            var result = base.VisitMemberAccess(m);

            var obj = GetCacheValue(m.Expression);
            var val = m.Member.GetValue(obj);
            _ValueDic[result] = val;

            return result;
        }

        protected override System.Linq.Expressions.Expression VisitConstant(ConstantExpression c)
        {
            var result = base.VisitConstant(c);

            _ValueDic[result] = c.Value;

            return result;
        }

        protected override System.Linq.Expressions.Expression VisitBinary(BinaryExpression b)
        {
            var result = (BinaryExpression)base.VisitBinary(b);

            if (result.NodeType == ExpressionType.ArrayIndex)
            {
                var leftVal = GetCacheValue(result.Left);
                var rightVal = GetCacheValue(result.Right);
                var val = ((Array)leftVal).GetValue((int)rightVal);
                _ValueDic[result] = val;
            }

            return result;
        }

        protected override System.Linq.Expressions.Expression VisitMethodCall(MethodCallExpression m)
        {
            var result = base.VisitMethodCall(m);

            var obj = GetCacheValue(m.Object);
            var paramGroup = m.Arguments.Select(GetCacheValue).ToArray();
            var val = m.Method.Invoke(obj, paramGroup);
            _ValueDic[result] = val;

            return result;
        }

        #endregion

    }
}